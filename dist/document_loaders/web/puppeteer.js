import { Document } from "../../document.js";
import { BaseDocumentLoader } from "../base.js";
/**
 * Class that extends the BaseDocumentLoader class and implements the
 * DocumentLoader interface. It represents a document loader for scraping
 * web pages using Puppeteer.
 */
export class PuppeteerWebBaseLoader extends BaseDocumentLoader {
    constructor(webPath, options) {
        super();
        Object.defineProperty(this, "webPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: webPath
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.options = options ?? undefined;
    }
    static async _scrape(url, options) {
        const { launch } = await PuppeteerWebBaseLoader.imports();
        const browser = await launch({
            headless: true,
            defaultViewport: null,
            ignoreDefaultArgs: ["--disable-extensions"],
            ...options?.launchOptions,
        });
        const page = await browser.newPage();
        await page.goto(url, {
            timeout: 180000,
            waitUntil: "domcontentloaded",
            ...options?.gotoOptions,
        });
        const bodyHTML = options?.evaluate
            ? await options?.evaluate(page, browser)
            : await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        return bodyHTML;
    }
    /**
     * Method that calls the _scrape method to perform the scraping of the web
     * page specified by the webPath property.
     * @returns Promise that resolves to the scraped HTML content of the web page.
     */
    async scrape() {
        return PuppeteerWebBaseLoader._scrape(this.webPath, this.options);
    }
    /**
     * Method that calls the scrape method and returns the scraped HTML
     * content as a Document object.
     * @returns Promise that resolves to an array of Document objects.
     */
    async load() {
        const text = await this.scrape();
        const metadata = { source: this.webPath };
        return [new Document({ pageContent: text, metadata })];
    }
    /**
     * Static method that imports the necessary Puppeteer modules. It returns
     * a Promise that resolves to an object containing the imported modules.
     * @returns Promise that resolves to an object containing the imported Puppeteer modules.
     */
    static async imports() {
        try {
            // eslint-disable-next-line import/no-extraneous-dependencies
            const { launch } = await import("puppeteer");
            return { launch };
        }
        catch (e) {
            console.error(e);
            throw new Error("Please install puppeteer as a dependency with, e.g. `yarn add puppeteer`");
        }
    }
}
