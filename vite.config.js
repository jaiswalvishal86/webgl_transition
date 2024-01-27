import glsl from "vite-plugin-glsl";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  envDir: __dirname,
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        page: resolve(__dirname, "src/page/work.html"),
      },
    },
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [glsl()],
});
