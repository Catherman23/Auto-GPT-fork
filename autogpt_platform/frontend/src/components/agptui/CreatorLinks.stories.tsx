import type { Meta, StoryObj } from "@storybook/react";
import { CreatorLinks } from "./CreatorLinks";

const meta = {
  title: "Agpt UI/marketing/Creator Links",
  component: CreatorLinks,
  decorators: [
    (Story) => (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    links: {
      control: "object",
      description: "Object containing various social and web links",
    },
  },
} satisfies Meta<typeof CreatorLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    links: [
      "https://example.com",
      "https://linkedin.com/in/johndoe",
      "https://github.com/johndoe",
      "https://twitter.com/johndoe",
      "https://medium.com/@johndoe",
    ],
  },
};

export const NoLinks: Story = {
  args: {
    links: [],
  },
};

export const MultipleOtherLinks: Story = {
  args: {
    links: [
      "https://example.com",
      "https://linkedin.com/in/creator",
      "https://github.com/creator",
      "https://twitter.com/creator",
      "https://medium.com/@creator",
      "https://youtube.com/@creator",
      "https://tiktok.com/@creator",
    ],
  },
};
