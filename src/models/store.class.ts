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

    const paragraphs: string[] = [];

    $("body")
      .contents()
      .each((_, el) => {
        if (el.type === "text") {
          const text = $(el).text().trim();
          if (text) {
            paragraphs.push(text);
          }
        } else if (el.type === "tag") {
          const tagName = el.tagName?.toLowerCase();

          if (
            tagName &&
            ["script", "style", "img", "meta", "link"].includes(tagName)
          ) {
            return;
          }
          const text = $(el).text().trim();
          if (text) {
            paragraphs.push(text);
          }
        }
      });

    return paragraphs;
  }
}
