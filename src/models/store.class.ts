import { CurrencyCodes, PriceFromUrlScraped, StoreInfo } from "../types";
import * as cheerio from "cheerio";

export abstract class Store {
  readonly name: string;
  readonly type: string;

  constructor(name: string, type?: string) {
    this.name = name;
    // this.url = url;
    this.type = type || "official";
  }

  abstract scrapeGamesFromSearch(
    term: string,
    currency: CurrencyCodes,
  ): Promise<StoreInfo>;
  abstract scrapeGameFromUrl(
    storeId: string,
  ): Promise<PriceFromUrlScraped | null>;

  extractTextFromHtml(element: string) {
    const $ = cheerio.load(element);
    const extractedText = $.text();
    return extractedText;
  }
}
