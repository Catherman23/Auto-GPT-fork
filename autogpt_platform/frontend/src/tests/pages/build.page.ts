import { ElementHandle, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

interface Block {
  id: string;
  name: string;
  description: string;
}

export class BuildPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async closeTutorial(): Promise<void> {
    console.log(`closing tutorial`);
    try {
      await this.page.getByRole("button", { name: "Skip Tutorial", exact: true }).click();
    } catch (error) {
      console.info("Error closing tutorial:", error);
    }
  }

  async openBlocksPanel(): Promise<void> {
    if (
      !(await this.page.getByTestId("blocks-control-blocks-label").isVisible())
    ) {
      await this.page.getByTestId("blocks-control-blocks-button").click();
    }
  }

  async closeBlocksPanel(): Promise<void> {
    console.log(`closing blocks panel`);
    if (
      await this.page.getByTestId("blocks-control-blocks-label").isVisible()
    ) {
      await this.page.getByTestId("blocks-control-blocks-button").click();
    }
  }

  async saveAgent(
    name: string = "Test Agent",
    description: string = "",
  ): Promise<void> {
    console.log(`saving agent ${name} with description ${description}`);
    await this.page.getByTestId("blocks-control-save-button").click();
    await this.page.getByTestId("save-control-name-input").fill(name);
    await this.page
      .getByTestId("save-control-description-input")
      .fill(description);
    await this.page.getByTestId("save-control-save-agent-button").click();
  }

  async getBlocks(): Promise<Block[]> {
    console.log(`getting blocks in sidebar panel`);
    try {
      const blocks = await this.page.locator('[data-id^="block-card-"]').all();

      console.log(`found ${blocks.length} blocks`);

      const results = await Promise.all(
        blocks.map(async (block) => {
          try {
            const fullId = (await block.getAttribute("data-id")) || "";
            const id = fullId.replace("block-card-", "");
            const nameElement = block.locator('[data-testid^="block-name-"]');
            const descriptionElement = block.locator(
              '[data-testid^="block-description-"]',
            );

            const name = (await nameElement.textContent()) || "";
            const description = (await descriptionElement.textContent()) || "";

            return {
              id,
              name: name.trim(),
              description: description.trim(),
            };
          } catch (elementError) {
            console.error("Error processing block:", elementError);
            return null;
          }
        }),
      );

      // Filter out any null results from errors
      return results.filter((block): block is Block => block !== null);
    } catch (error) {
      console.error("Error getting blocks:", error);
      return [];
    }
  }

  async addBlock(block: Block): Promise<void> {
    console.log(`adding block ${block.id} ${block.name} to agent`);
    await this.page.getByTestId(`block-name-${block.id}`).click();
  }

  async isRFNodeVisible(nodeId: string): Promise<boolean> {
    console.log(`checking if RF node ${nodeId} is visible on page`);
    return await this.page.getByTestId(`rf__node-${nodeId}`).isVisible();
  }

  async hasBlock(block: Block): Promise<boolean> {
    console.log(
      `checking if block ${block.id} ${block.name} is visible on page`,
    );
    try {
      // Use both ID and name for most precise matching
      const node = await this.page
        .locator(`[data-blockid="${block.id}"]`)
        .first();
      return await node.isVisible();
    } catch (error) {
      console.error("Error checking for block:", error);
      return false;
    }
  }

  async getBlockInputs(blockId: string): Promise<string[]> {
    console.log(`getting block ${blockId} inputs`);
    try {
      const node = await this.page
        .locator(`[data-blockid="${blockId}"]`)
        .first();
      const inputsData = await node.getAttribute("data-inputs");
      return inputsData ? JSON.parse(inputsData) : [];
    } catch (error) {
      console.error("Error getting block inputs:", error);
      return [];
    }
  }

  async getBlockOutputs(blockId: string): Promise<string[]> {
    throw new Error("Not implemented");
    // try {
    //   const node = await this.page
    //     .locator(`[data-blockid="${blockId}"]`)
    //     .first();
    //   const outputsData = await node.getAttribute("data-outputs");
    //   return outputsData ? JSON.parse(outputsData) : [];
    // } catch (error) {
    //   console.error("Error getting block outputs:", error);
    //   return [];
    // }
  }

  async _buildBlockSelector(blockId: string, dataId?: string): Promise<string> {
    let selector = dataId
      ? `[data-id="${dataId}"] [data-blockid="${blockId}"]`
      : `[data-blockid="${blockId}"]`;
    return selector;
  }

  async getBlockById(blockId: string, dataId?: string): Promise<Locator> {
    console.log(`getting block ${blockId} with dataId ${dataId}`);
    return await this.page.locator(
      await this._buildBlockSelector(blockId, dataId),
    );
  }

  // dataId is optional, if provided, it will start the search with that container, otherwise it will start with the blockId
  // this is useful if you have multiple blocks with the same id, but different dataIds which you should have when adding a block to the graph.
  // Do note that once you run an agent, the dataId will change, so you will need to update the tests to use the new dataId or not use the same block in tests that run an agent
  async fillBlockInputByPlaceholder(
    blockId: string,
    placeholder: string,
    value: string,
    dataId?: string,
  ): Promise<void> {
    console.log(
      `filling block input ${placeholder} with value ${value} of block ${blockId}`,
    );
    const block = await this.getBlockById(blockId, dataId);
    const input = await block.getByPlaceholder(placeholder);
    await input.fill(value);
  }

  async selectBlockInputValue(
    blockId: string,
    inputName: string,
    value: string,
    dataId?: string,
  ): Promise<void> {
    console.log(
      `selecting value ${value} for input ${inputName} of block ${blockId}`,
    );
    // First get the button that opens the dropdown
    const baseSelector = await this._buildBlockSelector(blockId, dataId);

    // Find the combobox button within the input handle container
    const comboboxSelector = `${baseSelector} [data-id="input-handle-${inputName.toLowerCase()}"] button[role="combobox"]`;

    try {
      // Click the combobox to open it
      await this.page.click(comboboxSelector);

      // Wait a moment for the dropdown to open
      await this.page.waitForTimeout(100);

      // Select the option from the dropdown
      // The actual selector for the option might need adjustment based on the dropdown structure
      await this.page.getByRole("option", { name: value }).click();
    } catch (error) {
      console.error(
        `Error selecting value "${value}" for input "${inputName}":`,
        error,
      );
      throw error;
    }
  }

  async fillBlockInputByLabel(
    blockId: string,
    label: string,
    value: string,
  ): Promise<void> {
    console.log(`filling block input ${label} with value ${value}`);
    const block = await this.getBlockById(blockId);
    const input = await block.getByLabel(label);
    await input.fill(value);
  }

  async connectBlockOutputToBlockInputViaDataId(
    blockOutputId: string,
    blockInputId: string,
  ): Promise<void> {
    console.log(
      `connecting block output ${blockOutputId} to block input ${blockInputId}`,
    );
    try {
      // Locate the output element
      const outputElement = await this.page.locator(
        `[data-id="${blockOutputId}"]`,
      );
      // Locate the input element
      const inputElement = await this.page.locator(
        `[data-id="${blockInputId}"]`,
      );

      await outputElement.dragTo(inputElement);
    } catch (error) {
      console.error("Error connecting block output to input:", error);
    }
  }

  async connectBlockOutputToBlockInputViaName(
    startBlockId: string,
    startBlockOutputName: string,
    endBlockId: string,
    endBlockInputName: string,
    startDataId?: string,
    endDataId?: string,
  ): Promise<void> {
    console.log(
      `connecting block output ${startBlockOutputName} of block ${startBlockId} to block input ${endBlockInputName} of block ${endBlockId}`,
    );
    const startBlockBase = await this._buildBlockSelector(
      startBlockId,
      startDataId,
    );
    const endBlockBase = await this._buildBlockSelector(endBlockId, endDataId);
    // Use descendant combinator to find test-id at any depth
    const startBlockOutputSelector = `${startBlockBase} [data-testid="output-handle-${startBlockOutputName.toLowerCase()}"]`;
    const endBlockInputSelector = `${endBlockBase} [data-testid="input-handle-${endBlockInputName.toLowerCase()}"]`;

    // Log for debugging
    console.log("Start block selector:", startBlockOutputSelector);
    console.log("End block selector:", endBlockInputSelector);

    await this.page
      .locator(startBlockOutputSelector)
      .dragTo(this.page.locator(endBlockInputSelector));
  }

  async isLoaded(): Promise<boolean> {
    console.log(`checking if build page is loaded`);
    try {
      await this.page.waitForLoadState("domcontentloaded", { timeout: 10_000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isRunButtonEnabled(): Promise<boolean> {
    console.log(`checking if run button is enabled`);
    const runButton = this.page.locator('[data-id="primary-action-run-agent"]');
    return await runButton.isEnabled();
  }

  async runAgent(): Promise<void> {
    console.log(`clicking run button`);
    const runButton = this.page.locator('[data-id="primary-action-run-agent"]');
    await runButton.click();
  }

  async fillRunDialog(inputs: Record<string, string>): Promise<void> {
    console.log(`filling run dialog`);
    for (const [key, value] of Object.entries(inputs)) {
      await this.page.getByTestId(`run-dialog-input-${key}`).fill(value);
    }
  }
  async clickRunDialogRunButton(): Promise<void> {
    console.log(`clicking run button`);
    await this.page.getByTestId("run-dialog-run-button").click();
  }

  async waitForCompletionBadge(): Promise<void> {
    console.log(`waiting for completion badge`);
    await this.page.waitForSelector(
      '[data-id^="badge-"][data-id$="-COMPLETED"]',
    );
  }

  async waitForSaveButton(): Promise<void> {
    console.log(`waiting for save button`);
    await this.page.waitForSelector(
      '[data-testid="blocks-control-save-button"]:not([disabled])',
    );
  }

  async isCompletionBadgeVisible(): Promise<boolean> {
    console.log(`checking for completion badge`);
    const completionBadge = this.page
      .locator('[data-id^="badge-"][data-id$="-COMPLETED"]')
      .first();
    return await completionBadge.isVisible();
  }

  async waitForVersionField(): Promise<void> {
    console.log(`waiting for version field`);

    // wait for the url to have the flowID
    await this.page.waitForSelector(
      '[data-testid="save-control-version-output"]',
    );
  }

  async createSingleBlockAgent(
    name: string,
    description: string,
    block: Block,
  ): Promise<void> {
    console.log(`creating single block agent ${name}`);
    await this.navbar.clickBuildLink();
    await this.closeTutorial();
    await this.openBlocksPanel();
    await this.addBlock(block);
    await this.saveAgent(name, description);
    await this.waitForVersionField();
  }

  async getBasicBlock(): Promise<Block> {
    return {
      id: "31d1064e-7446-4693-a7d4-65e5ca1180d1",
      name: "Add to Dictionary",
      description: "Add to Dictionary",
    };
  }
}
