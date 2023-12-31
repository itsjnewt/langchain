"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisChatMessageHistory = void 0;
// TODO: Deprecate in favor of stores/message/ioredis.ts when LLMCache and other implementations are ported
const redis_1 = require("redis");
const index_js_1 = require("../../schema/index.cjs");
const utils_js_1 = require("./utils.cjs");
/**
 * Class for storing chat message history using Redis. Extends the
 * `BaseListChatMessageHistory` class.
 */
class RedisChatMessageHistory extends index_js_1.BaseListChatMessageHistory {
    get lc_secrets() {
        return {
            "config.url": "REDIS_URL",
            "config.username": "REDIS_USERNAME",
            "config.password": "REDIS_PASSWORD",
        };
    }
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "stores", "message", "redis"]
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionTTL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const { sessionId, sessionTTL, config, client } = fields;
        this.client = (client ?? (0, redis_1.createClient)(config ?? {}));
        this.sessionId = sessionId;
        this.sessionTTL = sessionTTL;
    }
    /**
     * Ensures the Redis client is ready to perform operations. If the client
     * is not ready, it attempts to connect to the Redis database.
     * @returns Promise resolving to true when the client is ready.
     */
    async ensureReadiness() {
        if (!this.client.isReady) {
            await this.client.connect();
        }
        return true;
    }
    /**
     * Retrieves all chat messages from the Redis database for the current
     * session.
     * @returns Promise resolving to an array of `BaseMessage` instances.
     */
    async getMessages() {
        await this.ensureReadiness();
        const rawStoredMessages = await this.client.lRange(this.sessionId, 0, -1);
        const orderedMessages = rawStoredMessages
            .reverse()
            .map((message) => JSON.parse(message));
        return (0, utils_js_1.mapStoredMessagesToChatMessages)(orderedMessages);
    }
    /**
     * Adds a new chat message to the Redis database for the current session.
     * @param message The `BaseMessage` instance to add.
     * @returns Promise resolving when the message has been added.
     */
    async addMessage(message) {
        await this.ensureReadiness();
        const messageToAdd = (0, utils_js_1.mapChatMessagesToStoredMessages)([message]);
        await this.client.lPush(this.sessionId, JSON.stringify(messageToAdd[0]));
        if (this.sessionTTL) {
            await this.client.expire(this.sessionId, this.sessionTTL);
        }
    }
    /**
     * Deletes all chat messages from the Redis database for the current
     * session.
     * @returns Promise resolving when the messages have been deleted.
     */
    async clear() {
        await this.ensureReadiness();
        await this.client.del(this.sessionId);
    }
}
exports.RedisChatMessageHistory = RedisChatMessageHistory;
