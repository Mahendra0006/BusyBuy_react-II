import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: [
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.svg",
    "**/*.gif",
    "**/*.webp",
  ],
  build: {
    assetsInlineLimit: 0, // External image URLs won't be inlined
  },
});
