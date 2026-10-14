import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Library mode: build src/index.ts into dist/index.js + dist/styles.css,
// instead of building a website.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rollupOptions: {
      // React comes from the app that uses this package (peer dependency), so don't bundle it.
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
