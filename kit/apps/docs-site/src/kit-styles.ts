// Loads the kit's CSS once for the whole site, the same way an app would.

// Font files. The tokens only name the fonts, so the site must load them itself.
// One file per weight the typography tokens use (light to bold).
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-mono/400.css";

// The docs site's own font, for the site's text only (not part of the kit).
// The variable font is one file that covers every weight.
import "@fontsource-variable/lexend";

// Design tokens (the --shk- CSS variables) and the styles of every ui component.
import "@detriz-sh-kit/tokens/tokens.css";
import "@detriz-sh-kit/ui/styles.css";
