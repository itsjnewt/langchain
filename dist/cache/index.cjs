"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCache = void 0;
const base_js_1 = require("./base.cjs");
const index_js_1 = require("../schema/index.cjs");
const GLOBAL_MAP = new Map();
/**
 * A cache for storing LLM generations that stores data in memory.
 */
class InMemoryCache extends index_js_1.BaseCache {
    constructor(map) {
        super();
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.cache = map ?? new Map();
    }
    /**
     * Retrieves data from the cache using a prompt and an LLM key. If the
     * data is not found, it returns null.
     * @param prompt The prompt used to find the data.
     * @param llmKey The LLM key used to find the data.
     * @returns The data corresponding to the prompt and LLM key, or null if not found.
     */
    lookup(prompt, llmKey) {
        return Promise.resolve(this.cache.get((0, base_js_1.getCacheKey)(prompt, llmKey)) ?? null);
    }
    /**
     * Updates the cache with new data using a prompt and an LLM key.
     * @param prompt The prompt used to store the data.
     * @param llmKey The LLM key used to store the data.
     * @param value The data to be stored.
     */
    async update(prompt, llmKey, value) {
        this.cache.set((0, base_js_1.getCacheKey)(prompt, llmKey), value);
    }
    /**
     * Returns a global instance of InMemoryCache using a predefined global
     * map as the initial cache.
     * @returns A global instance of InMemoryCache.
     */
    static global() {
        return new InMemoryCache(GLOBAL_MAP);
    }
}
exports.InMemoryCache = InMemoryCache;
