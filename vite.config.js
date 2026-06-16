import path from "node:path";
import { copyFileSync } from "node:fs";
import { builtinModules } from "node:module";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// Copy the runtime-loaded cooklang WASM next to main.js after each build.
function copyCooklangWasm() {
  return {
    name: "copy-cooklang-wasm",
    closeBundle() {
      copyFileSync(
        path.resolve(__dirname, "node_modules/@cooklang/cooklang/pkg/cooklang_wasm_bg.wasm"),
        path.resolve(__dirname, "cooklang_wasm_bg.wasm"),
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const prod = mode === "production";

  return {
    plugins: [svelte(), tailwindcss(), copyCooklangWasm()],
    build: {
      sourcemap: prod ? false : "inline",
      minify: prod,
      // Output straight into the plugin root so Obsidian picks it up.
      outDir: ".",
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__dirname, "src/main.ts"),
        formats: ["cjs"],
      },
      rollupOptions: {
        output: {
          entryFileNames: "main.js",
          assetFileNames: "styles.css",
        },
        external: [
          "obsidian",
          "electron",
          "@codemirror/autocomplete",
          "@codemirror/collab",
          "@codemirror/commands",
          "@codemirror/language",
          "@codemirror/lint",
          "@codemirror/search",
          "@codemirror/state",
          "@codemirror/view",
          "@lezer/common",
          "@lezer/highlight",
          "@lezer/lr",
          ...builtinModules,
          ...builtinModules.map((m) => `node:${m}`),
        ],
      },
    },
  };
});
