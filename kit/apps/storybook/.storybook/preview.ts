import type { Preview } from "@storybook/react-vite";

// Load the design tokens (CSS variables) once, for every story, the same way an app would.
import "@detriz-sh-kit/tokens/tokens.css";

const preview: Preview = {};

export default preview;
