import type { Preview } from "@storybook/react-vite";

// Load the font files once. The tokens only name the fonts, so an app must load them itself.
// One file per weight the typography tokens use (light to bold).
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-mono/400.css";

// Load the design tokens (CSS variables) once, for every story, the same way an app would.
import "@detriz-sh-kit/tokens/tokens.css";

const preview: Preview = {};

export default preview;
