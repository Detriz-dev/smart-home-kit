import type { Preview } from "@storybook/react-vite";

// Load the kit's font files once, the same way an app would.
import "@detriz-sh-kit/ui/fonts.css";

// Load the design tokens (CSS variables) once, for every story, the same way an app would.
import "@detriz-sh-kit/tokens/tokens.css";

const preview: Preview = {};

export default preview;
