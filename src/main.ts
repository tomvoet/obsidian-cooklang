import { normalizePath, Plugin } from "obsidian";
import { mount } from "svelte";

import RecipeView from "./ui/RecipeView.svelte";
import { initCooklang } from "./cooklang";

import "./app.css";

const WASM_FILE = "cooklang_wasm_bg.wasm";

export default class CookPlugin extends Plugin {
  async onload() {
    await this.loadCooklangWasm();

    this.registerMarkdownCodeBlockProcessor("cooklang", (source, el) => {
      mount(RecipeView, { target: el, props: { source } });
    });
  }

  async loadCooklangWasm(): Promise<void> {
    if (!this.manifest.dir) {
      throw new Error("Cooklang: cannot locate the plugin directory to load the WASM parser.");
    }
    const wasmPath = normalizePath(`${this.manifest.dir}/${WASM_FILE}`);
    const wasmBytes = await this.app.vault.adapter.readBinary(wasmPath);
    await initCooklang(wasmBytes);
  }
}
