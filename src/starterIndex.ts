import { App, Platform, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import RecipeView from './ui/RecipeView.svelte';

import { VIEW_TYPE } from './ui/ShoppingListView';
import CookShoppingListView from './ui/ShoppingListView';

import store from './store';

interface CookPluginSettings {
    shoppingListRibbonIcon: boolean;
    mySetting: string;
}

const DEFAULT_SETTINGS: CookPluginSettings = {
    shoppingListRibbonIcon: true,
    mySetting: 'default'
}

export default class CookPlugin extends Plugin {
    private view: CookShoppingListView;
    settings: CookPluginSettings;

    async onload() {
        await this.loadSettings();

        store.plugin.set(this);

        this.registerMarkdownCodeBlockProcessor('cooklang', (source, el, _) => {
            new RecipeView({
                target: el, props: {
                    source: source
                }
            });
        });

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => (this.view = new CookShoppingListView(leaf))
        );

        this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

        // This creates an icon in the left ribbon.
        this.addRibbonIcon('shopping-cart', 'Shopping List', (evt: MouseEvent) => this.openShoppingList());

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: 'cook-open-shopping-list',
            name: 'Open Shopping List',
            callback: () => this.openShoppingList(),
        });
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new CookSettingTab(this.app, this));
    }

    onLayoutReady(): void {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
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
        const leaf = workspace.getLeaf(
            // @ts-ignore
            !Platform.isMobile
        );
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

        containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

        new Setting(containerEl)
            .setName('Shopping List Ribbon Icon')
            .setDesc('When enabled, a shopping list icon will appear in the left ribbon.')
            .addToggle((toggle) => {
                toggle
                    .setValue(true)
                    .onChange(async (value) => {
                        console.log('Toggled', value);
                        this.plugin.settings.shoppingListRibbonIcon = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
