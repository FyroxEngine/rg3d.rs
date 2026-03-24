/* tslint:disable */
/* eslint-disable */

/**
 * An opaque "handle" to platform-dependent audio output device.
 */
export class OutputDevice {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Closes the output device and release all system resources occupied by it. Any calls of this
     * method after the device was closed does nothing.
     */
    close(): void;
}

export function main(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly main: () => void;
    readonly __wbg_outputdevice_free: (a: number, b: number) => void;
    readonly outputdevice_close: (a: number) => void;
    readonly wasm_bindgen__closure__destroy__h1ad2978223a4bc3a: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__h18a7a09f18651e5a: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__h817c3083d6992c84: (a: number, b: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hdd227d8a3c30fceb: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h01f7b52e097b8838: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6_3: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6_4: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6_5: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6_6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6_7: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6_8: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0ba9f8b3b6f374f6_9: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hc95fe144b8f450d1: (a: number, b: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h82964c4a1e2445cf: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
