"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfQueryRetriever = exports.FunctionalTranslator = exports.BasicTranslator = exports.BaseTranslator = void 0;
const index_js_1 = require("../../chains/query_constructor/index.cjs");
const retriever_js_1 = require("../../schema/retriever.cjs");
const functional_js_1 = require("./functional.cjs");
Object.defineProperty(exports, "FunctionalTranslator", { enumerable: true, get: function () { return functional_js_1.FunctionalTranslator; } });
const base_js_1 = require("./base.cjs");
Object.defineProperty(exports, "BaseTranslator", { enumerable: true, get: function () { return base_js_1.BaseTranslator; } });
Object.defineProperty(exports, "BasicTranslator", { enumerable: true, get: function () { return base_js_1.BasicTranslator; } });
/**
 * Class for question answering over an index. It retrieves relevant
 * documents based on a query. It extends the BaseRetriever class and
 * implements the SelfQueryRetrieverArgs interface.
 */
class SelfQueryRetriever extends retriever_js_1.BaseRetriever {
    static lc_name() {
        return "SelfQueryRetriever";
    }
    get lc_namespace() {
        return ["langchain", "retrievers", "self_query"];
    }
    constructor(options) {
        super(options);
        Object.defineProperty(this, "vectorStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "structuredQueryTranslator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "useOriginalQuery", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "searchParams", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { k: 4 }
        });
        this.vectorStore = options.vectorStore;
        this.llmChain = options.llmChain;
        this.verbose = options.verbose ?? false;
        this.searchParams = options.searchParams ?? this.searchParams;
        this.useOriginalQuery = options.useOriginalQuery ?? this.useOriginalQuery;
        this.structuredQueryTranslator = options.structuredQueryTranslator;
    }
    async _getRelevantDocuments(query, runManager) {
        const { [this.llmChain.outputKey]: output } = await this.llmChain.call({
            [this.llmChain.inputKeys[0]]: query,
        }, runManager?.getChild("llm_chain"));
        const generatedStructuredQuery = output;
        const nextArg = this.structuredQueryTranslator.visitStructuredQuery(generatedStructuredQuery);
        const filter = this.structuredQueryTranslator.mergeFilters(this.searchParams?.filter, nextArg.filter, this.searchParams?.mergeFiltersOperator);
        const generatedQuery = generatedStructuredQuery.query;
        let myQuery = query;
        if (!this.useOriginalQuery && generatedQuery && generatedQuery.length > 0) {
            myQuery = generatedQuery;
        }
        if (!filter) {
            return [];
        }
        else {
            return this.vectorStore.similaritySearch(myQuery, this.searchParams?.k, filter, runManager?.getChild("vectorstore"));
        }
    }
    /**
     * Static method to create a new SelfQueryRetriever instance from a
     * BaseLanguageModel and a VectorStore. It first loads a query constructor
     * chain using the loadQueryConstructorChain function, then creates a new
     * SelfQueryRetriever instance with the loaded chain and the provided
     * options.
     * @param options The options used to create the SelfQueryRetriever instance. It includes the QueryConstructorChainOptions and all the SelfQueryRetrieverArgs except 'llmChain'.
     * @returns A new instance of SelfQueryRetriever.
     */
    static fromLLM(options) {
        const { structuredQueryTranslator, allowedComparators, allowedOperators, llm, documentContents, attributeInfo, examples, vectorStore, ...rest } = options;
        const llmChain = (0, index_js_1.loadQueryConstructorChain)({
            llm,
            documentContents,
            attributeInfo,
            examples,
            allowedComparators: allowedComparators ?? structuredQueryTranslator.allowedComparators,
            allowedOperators: allowedOperators ?? structuredQueryTranslator.allowedOperators,
        });
        return new SelfQueryRetriever({
            ...rest,
            llmChain,
            vectorStore,
            structuredQueryTranslator,
        });
    }
}
exports.SelfQueryRetriever = SelfQueryRetriever;