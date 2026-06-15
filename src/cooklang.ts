// Custom loader for @cooklang/cooklang.
//
// The package is a wasm-bindgen "bundler target" module: its normal entry
// (`@cooklang/cooklang`) does `import * as wasm from "./cooklang_wasm_bg.wasm"`
// and instantiates the WASM at module-load time. That cannot be bundled into the
// single, synchronously-required CommonJS file Obsidian expects.
//
// Instead we import only the JS bindings glue (`cooklang_wasm_bg.js`, which does
// not touch the WASM binary) and instantiate the module ourselves, once, at
// plugin startup. The 2 MB `.wasm` ships next to main.js and is read at runtime
// (see CookPlugin.onload), so it never goes through the bundler.

import * as bg from "@cooklang/cooklang/pkg/cooklang_wasm_bg.js";
import type { Quantity, Value } from "@cooklang/cooklang/pkg/cooklang_wasm.js";

let ready = false;

/**
 * Instantiate the cooklang WASM module. Must be awaited once before any parsing.
 * Safe to call multiple times; subsequent calls are no-ops.
 */
export async function initCooklang(wasmBytes: BufferSource): Promise<void> {
  if (ready) return;

  const module = await WebAssembly.compile(wasmBytes);
  const instance = await WebAssembly.instantiate(module, {
    // The import module name embedded in the .wasm is "./cooklang_wasm_bg.js".
    "./cooklang_wasm_bg.js": bg as unknown as WebAssembly.ModuleImports,
  });

  bg.__wbg_set_wasm(instance.exports);
  // This build does not export __wbindgen_start; call it only if present.
  const start = (instance.exports as Record<string, unknown>).__wbindgen_start;
  if (typeof start === "function") start();

  ready = true;
}

export const Parser = bg.Parser;
export const ingredient_display_name = bg.ingredient_display_name;
export const ingredient_should_be_listed = bg.ingredient_should_be_listed;
export const grouped_quantity_display = bg.grouped_quantity_display;
export const grouped_quantity_is_empty = bg.grouped_quantity_is_empty;
export const cookware_display_name = bg.cookware_display_name;
export const cookware_should_be_listed = bg.cookware_should_be_listed;
export const quantity_display = bg.quantity_display;

// The declared `Value` type understates the runtime shape: the number is nested
// one level deeper, e.g. { type: "number", value: { value: 3 } }.
function numericValue(value: Value | null | undefined): number | null {
  if (!value) return null;
  const raw = value as unknown as {
    type: string;
    value: { value?: unknown; start?: { value?: unknown } };
  };
  if (raw.type === "number") return Number(raw.value.value);
  if (raw.type === "range") return Number(raw.value.start?.value);
  return null;
}

const UNIT_SECONDS: Record<string, number> = {
  s: 1, sec: 1, secs: 1, second: 1, seconds: 1,
  m: 60, min: 60, mins: 60, minute: 60, minutes: 60,
  h: 3600, hr: 3600, hrs: 3600, hour: 3600, hours: 3600,
  d: 86400, day: 86400, days: 86400,
};

/**
 * Convert a timer's quantity to whole seconds for the countdown component.
 * Bare timers (no unit) are treated as minutes, matching cooklang's default.
 */
export function timerSeconds(quantity: Quantity | null | undefined): number {
  if (!quantity) return 0;
  const value = numericValue(quantity.value);
  if (value === null) return 0;
  const unit = quantity.unit?.toLowerCase().trim();
  const factor = unit && unit in UNIT_SECONDS ? UNIT_SECONDS[unit] : 60;
  return Math.round(value * factor);
}

export type {
  ScaledRecipeWithReport,
  Recipe,
  Ingredient,
  Cookware,
  Timer,
  Quantity,
  Value,
  GroupedQuantity,
  GroupedIndexAndQuantity,
  Section,
  Content,
  Step,
  Item,
} from "@cooklang/cooklang/pkg/cooklang_wasm.js";
