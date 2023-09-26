import { BaseStore } from "../schema/storage.js";
/**
 * In-memory implementation of the BaseStore using a dictionary. Used for
 * storing key-value pairs in memory.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class InMemoryStore extends BaseStore {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "storage", "in_memory"]
        });
        Object.defineProperty(this, "store", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    /**
     * Retrieves the values associated with the given keys from the store.
     * @param keys Keys to retrieve values for.
     * @returns Array of values associated with the given keys.
     */
    async mget(keys) {
        return keys.map((key) => this.store[key]);
    }
    /**
     * Sets the values for the given keys in the store.
     * @param keyValuePairs Array of key-value pairs to set in the store.
     * @returns Promise that resolves when all key-value pairs have been set.
     */
    async mset(keyValuePairs) {
        for (const [key, value] of keyValuePairs) {
            this.store[key] = value;
        }
    }
    /**
     * Deletes the given keys and their associated values from the store.
     * @param keys Keys to delete from the store.
     * @returns Promise that resolves when all keys have been deleted.
     */
    async mdelete(keys) {
        for (const key of keys) {
            delete this.store[key];
        }
    }
    /**
     * Asynchronous generator that yields keys from the store. If a prefix is
     * provided, it only yields keys that start with the prefix.
     * @param prefix Optional prefix to filter keys.
     * @returns AsyncGenerator that yields keys from the store.
     */
    async *yieldKeys(prefix) {
        const keys = Object.keys(this.store);
        for (const key of keys) {
            if (prefix === undefined || key.startsWith(prefix)) {
                yield key;
            }
        }
    }
}
