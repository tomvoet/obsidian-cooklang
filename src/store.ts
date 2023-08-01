import { writable } from "svelte/store";
import type CookPlugin from "./starterIndex";
import type { Ingredient } from "@cooklang/cooklang-ts";

const plugin = writable<CookPlugin>();
const shoppingList = {
  items: writable<Ingredient[]>([]),
  add: (item: Ingredient) => {
    shoppingList.items.update((items) => [...items, item]);
  },
  remove: (item: Ingredient) => {
    shoppingList.items.update((items) => {
      const index = items.findIndex((i) => i.name === item.name);
      if (index !== -1) { items.splice(index, 1); }
      return items;
    })
  }
}

export default { plugin, shoppingList };