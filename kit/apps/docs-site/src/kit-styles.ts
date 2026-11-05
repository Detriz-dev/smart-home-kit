// Loads the kit's CSS once for the whole site, the same way an app would.

// The kit's font files (Space Grotesk and Space Mono), the same way an app loads them.
import "@detriz-sh-kit/ui/fonts.css";

// The docs site's own font, for the site's text only (not part of the kit).
// The variable font is one file that covers every weight.
import "@fontsource-variable/lexend";

// Design tokens (the --shk- CSS variables) and the styles of every ui component.
import "@detriz-sh-kit/tokens/tokens.css";
import "@detriz-sh-kit/ui/styles.css";
