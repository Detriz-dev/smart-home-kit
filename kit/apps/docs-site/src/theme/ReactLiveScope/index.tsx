// Everything a ```jsx live code block can use without importing it:
// React (and its hooks, like useState) and every export of @detriz-sh-kit/ui.
// A new component shows up here by itself once it is exported from ui's src/index.ts.
import React from "react";
import * as Kit from "@detriz-sh-kit/ui";

const ReactLiveScope = {
  React,
  ...React,
  ...Kit,
};

export default ReactLiveScope;
