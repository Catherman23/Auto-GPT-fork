import type { Meta, StoryObj } from "@storybook/react";
import { BecomeACreator } from "./BecomeACreator";
import { userEvent, within } from "@storybook/test";

const meta = {
  title: "Agpt UI/marketing/Become A Creator",
  component: BecomeACreator,
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    buttonText: { control: "text" },
    onButtonClick: { action: "buttonClicked" },
  },
} satisfies Meta<typeof BecomeACreator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Become a Creator",
    buttonText: "Upload your agent",
    onButtonClick: () => console.log("Button clicked"),
  },
};

export const TestingInteractions: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText("Become a Creator");

    await userEvent.click(button);
  },
};
