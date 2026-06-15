import {
  App,
  normalizePath,
  Platform,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
} from 'obsidian';
import { mount } from 'svelte';

import RecipeView from './ui/RecipeView.svelte';
import CookShoppingListView, { VIEW_TYPE } from './ui/ShoppingListView';
import { initCooklang } from './cooklang';
import store from './store';

const WASM_FILE = 'cooklang_wasm_bg.wasm';

interface CookPluginSettings {
  shoppingListRibbonIcon: boolean;
}

const DEFAULT_SETTINGS: CookPluginSettings = {
  shoppingListRibbonIcon: true,
};

export default class CookPlugin extends Plugin {
  declare settings: CookPluginSettings;
  private ribbonIcon: HTMLElement | null = null;

  async onload() {
    await this.loadSettings();

    await this.loadCooklangWasm();

    store.plugin.set(this);

    this.registerMarkdownCodeBlockProcessor('cooklang', (source, el) => {
      mount(RecipeView, { target: el, props: { source } });
    });

    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new CookShoppingListView(leaf),
    );

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

    if (this.settings.shoppingListRibbonIcon) {
      this.ribbonIcon = this.addRibbonIcon('shopping-cart', 'Open shopping list', () =>
        this.openShoppingList(),
      );
    }

    this.addCommand({
      id: 'open-shopping-list',
      name: 'Open shopping list',
      callback: () => this.openShoppingList(),
    });

    this.addSettingTab(new CookSettingTab(this.app, this));
  }

  async loadCooklangWasm(): Promise<void> {
    if (!this.manifest.dir) {
      throw new Error('Cooklang: cannot locate the plugin directory to load the WASM parser.');
    }
    const wasmPath = normalizePath(`${this.manifest.dir}/${WASM_FILE}`);
    const wasmBytes = await this.app.vault.adapter.readBinary(wasmPath);
    await initCooklang(wasmBytes);
  }

  onLayoutReady(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false)?.setViewState({
      type: VIEW_TYPE,
    });
  }

  onunload() {
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE)
      .forEach((leaf) => leaf.detach());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async openShoppingList() {
    const workspace = this.app.workspace;
    workspace.detachLeavesOfType(VIEW_TYPE);
    const leaf = workspace.getLeaf(!Platform.isMobile);
    await leaf.setViewState({ type: VIEW_TYPE });
    workspace.revealLeaf(leaf);
  }
}

class CookSettingTab extends PluginSettingTab {
  plugin: CookPlugin;

  constructor(app: App, plugin: CookPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Shopping list ribbon icon')
      .setDesc('Show a shopping list icon in the left ribbon (needs a reload).')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.shoppingListRibbonIcon)
          .onChange(async (value) => {
            this.plugin.settings.shoppingListRibbonIcon = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
