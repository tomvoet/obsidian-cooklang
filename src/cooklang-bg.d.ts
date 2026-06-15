// @cooklang/cooklang ships no type declarations for the raw bindings glue, so we
// derive them from the typed bundler entry and add the wasm setter we call.
declare module "@cooklang/cooklang/pkg/cooklang_wasm_bg.js" {
  export * from "@cooklang/cooklang/pkg/cooklang_wasm.js";
  export function __wbg_set_wasm(wasm: WebAssembly.Exports): void;
}
