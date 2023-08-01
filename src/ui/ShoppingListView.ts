import { ItemView, WorkspaceLeaf } from "obsidian";
import ShoppingList from "./ShoppingList.svelte";

export const VIEW_TYPE = "cook-shopping-list-view";


export default class CookShoppingListView extends ItemView {
  view: ShoppingList;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Shopping List";
  }

  getIcon(): string {
    return "shopping-basket";
  }

  async onOpen(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.view = new ShoppingList({ target: (this as any).contentEl, props: {} });
  }

  async onClose(): Promise<void> {
    this.view.$destroy();
  }
}