from enum import Enum
from typing import Literal, Optional

from pydantic import SecretStr
from replicate.client import Client as ReplicateClient
from replicate.helpers import FileOutput

from backend.data.block import Block, BlockCategory, BlockOutput, BlockSchema
from backend.data.model import (
    APIKeyCredentials,
    CredentialsField,
    CredentialsMetaInput,
    SchemaField,
)
from backend.integrations.providers import ProviderName

TEST_CREDENTIALS = APIKeyCredentials(
    id="01234567-89ab-cdef-0123-456789abcdef",
    provider="replicate",
    api_key=SecretStr("mock-replicate-api-key"),
    title="Mock Replicate API key",
    expires_at=None,
)
TEST_CREDENTIALS_INPUT = {
    "provider": TEST_CREDENTIALS.provider,
    "id": TEST_CREDENTIALS.id,
    "type": TEST_CREDENTIALS.type,
    "title": TEST_CREDENTIALS.type,
}


class FluxKontextModelName(str, Enum):
    PRO = "Flux Kontext Pro"
    MAX = "Flux Kontext Max"

    @property
    def api_name(self) -> str:
        return {
            FluxKontextModelName.PRO: "black-forest-labs/flux-kontext-pro",
            FluxKontextModelName.MAX: "black-forest-labs/flux-kontext-max",
        }[self]


class FluxKontextBlock(Block):
    class Input(BlockSchema):
        credentials: CredentialsMetaInput[
            Literal[ProviderName.REPLICATE], Literal["api_key"]
        ] = CredentialsField(
            description="Replicate API key with permissions for Flux Kontext models",
        )
        prompt: str = SchemaField(
            description="Text instruction describing the desired edit",
            title="Prompt",
        )
        input_image: Optional[str] = SchemaField(
            description="Reference image URI (jpeg, png, gif, webp)",
            default=None,
            title="Input Image",
        )
        aspect_ratio: str = SchemaField(
            description="Aspect ratio of the generated image",
            default="match_input_image",
            title="Aspect Ratio",
            advanced=False,
        )
        seed: Optional[int] = SchemaField(
            description="Random seed. Set for reproducible generation",
            default=None,
            title="Seed",
            advanced=True,
        )
        model: FluxKontextModelName = SchemaField(
            description="Model variant to use",
            default=FluxKontextModelName.PRO,
            title="Model",
        )

    class Output(BlockSchema):
        image_url: str = SchemaField(description="URL of the transformed image")
        error: str = SchemaField(description="Error message if generation failed")

    def __init__(self):
        super().__init__(
            id="3fd9c73d-4370-4925-a1ff-1b86b99fabfa",
            description=(
                "Edit images using BlackForest Labs' Flux Kontext models. Provide a prompt "
                "and optional reference image to generate a modified image."
            ),
            categories={BlockCategory.AI, BlockCategory.MULTIMEDIA},
            input_schema=FluxKontextBlock.Input,
            output_schema=FluxKontextBlock.Output,
            test_input={
                "prompt": "Add a hat to the cat",
                "input_image": "https://example.com/cat.png",
                "aspect_ratio": "match_input_image",
                "seed": None,
                "model": FluxKontextModelName.PRO,
                "credentials": TEST_CREDENTIALS_INPUT,
            },
            test_output=[
                ("image_url", "https://replicate.com/output/edited-image.png"),
            ],
            test_mock={
                "run_model": lambda api_key, model_name, prompt, input_image, aspect_ratio, seed: "https://replicate.com/output/edited-image.png",
            },
            test_credentials=TEST_CREDENTIALS,
        )

    def run(
        self,
        input_data: Input,
        *,
        credentials: APIKeyCredentials,
        **kwargs,
    ) -> BlockOutput:
        seed = input_data.seed
        result = self.run_model(
            api_key=credentials.api_key,
            model_name=input_data.model.api_name,
            prompt=input_data.prompt,
            input_image=input_data.input_image,
            aspect_ratio=input_data.aspect_ratio,
            seed=seed,
        )
        yield "image_url", result

    def run_model(
        self,
        api_key: SecretStr,
        model_name: str,
        prompt: str,
        input_image: Optional[str],
        aspect_ratio: str,
        seed: Optional[int],
    ) -> str:
        client = ReplicateClient(api_token=api_key.get_secret_value())
        input_params = {
            "prompt": prompt,
            "input_image": input_image,
            "aspect_ratio": aspect_ratio,
        }
        if seed is not None:
            input_params["seed"] = seed

        output: FileOutput | list[FileOutput] = client.run(  # type: ignore
            model_name,
            input=input_params,
            wait=False,
        )

        if isinstance(output, list) and output:
            first = output[0]
            if isinstance(first, FileOutput):
                return first.url
            return first
        if isinstance(output, FileOutput):
            return output.url
        if isinstance(output, str):
            return output
        return "No output received"
