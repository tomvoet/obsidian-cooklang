import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import ShoppingList from "./ShoppingList.svelte";

export const VIEW_TYPE = "cook-shopping-list-view";

export default class CookShoppingListView extends ItemView {
  private component: ReturnType<typeof mount> | undefined;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Shopping list";
  }

  getIcon(): string {
    return "shopping-basket";
  }

  async onOpen(): Promise<void> {
    this.component = mount(ShoppingList, { target: this.contentEl });
  }

  async onClose(): Promise<void> {
    if (this.component) {
      unmount(this.component);
    }
  }
}
