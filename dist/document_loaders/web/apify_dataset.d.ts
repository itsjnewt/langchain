import { ApifyClient, ApifyClientOptions, ActorCallOptions, TaskCallOptions } from "apify-client";
import { Document } from "../../document.js";
import { BaseDocumentLoader, DocumentLoader } from "../base.js";
/**
 * A type that represents a function that takes a single object (an Apify
 * dataset item) and converts it to an instance of the Document class.
 */
export type ApifyDatasetMappingFunction = (item: Record<string | number, unknown>) => Document;
/**
 * A class that extends the BaseDocumentLoader and implements the
 * DocumentLoader interface. It represents a document loader that loads
 * documents from an Apify dataset.
 */
export declare class ApifyDatasetLoader extends BaseDocumentLoader implements DocumentLoader {
    protected apifyClient: ApifyClient;
    protected datasetId: string;
    protected datasetMappingFunction: (item: Record<string | number, unknown>) => Document;
    constructor(datasetId: string, config: {
        datasetMappingFunction: ApifyDatasetMappingFunction;
        clientOptions?: ApifyClientOptions;
    });
    private static _getApifyApiToken;
    /**
     * Retrieves the dataset items from the Apify platform and applies the
     * datasetMappingFunction to each item to create an array of Document
     * instances.
     * @returns An array of Document instances.
     */
    load(): Promise<Document[]>;
    /**
     * Create an ApifyDatasetLoader by calling an Actor on the Apify platform and waiting for its results to be ready.
     * @param actorId The ID or name of the Actor on the Apify platform.
     * @param input The input object of the Actor that you're trying to run.
     * @param options Options specifying settings for the Actor run.
     * @param options.datasetMappingFunction A function that takes a single object (an Apify dataset item) and converts it to an instance of the Document class.
     * @returns An instance of `ApifyDatasetLoader` with the results from the Actor run.
     */
    static fromActorCall(actorId: string, input: Record<string | number, unknown>, config: {
        callOptions?: ActorCallOptions;
        clientOptions?: ApifyClientOptions;
        datasetMappingFunction: ApifyDatasetMappingFunction;
    }): Promise<ApifyDatasetLoader>;
    /**
     * Create an ApifyDatasetLoader by calling a saved Actor task on the Apify platform and waiting for its results to be ready.
     * @param taskId The ID or name of the task on the Apify platform.
     * @param input The input object of the task that you're trying to run. Overrides the task's saved input.
     * @param options Options specifying settings for the task run.
     * @param options.datasetMappingFunction A function that takes a single object (an Apify dataset item) and converts it to an instance of the Document class.
     * @returns An instance of `ApifyDatasetLoader` with the results from the task's run.
     */
    static fromActorTaskCall(taskId: string, input: Record<string | number, unknown>, config: {
        callOptions?: TaskCallOptions;
        clientOptions?: ApifyClientOptions;
        datasetMappingFunction: ApifyDatasetMappingFunction;
    }): Promise<ApifyDatasetLoader>;
}
