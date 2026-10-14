import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // Stories live next to their components in @detriz-sh-kit/ui, not in this app.
  stories: ["../../../packages/ui/src/**/*.stories.@(ts|tsx)"],
  framework: "@storybook/react-vite",
};

export default config;
