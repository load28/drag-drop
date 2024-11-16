import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/DragDrop.ts"),
      name: "DragDrop",
      fileName: "drag-drop-lib",
    },
  },
  server: {
    open: "/example/index.html",
  },
});
