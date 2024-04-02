import { Page } from "playwright";
import { parseUrl, replaceSteam } from "../../utils/game";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";

export class SteamStore extends Store {
  constructor() {
    super("Steam", "https://store.steampowered.com/search/?term=");
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "+");
    this.setUrl(this.getUrl() + queryUrl + "&category1=998&ndl=1"); // pc game
    return this.getUrl();
  }

  async scrapeGames(page: Page, query: string): Promise<StoreInfo | []> {
    await page.goto(this.modifyUrl(query));
    await page.waitForSelector("div.search_results");

    const notFound = await page.evaluate(() =>
      document.querySelector("div#search_resultsRows")
    );
    if (!notFound) {
      return [];
    }

    const content: GamePriceInfo[] = await page.$$eval(
      "div#search_resultsRows a.search_result_row",
      (elements: HTMLAnchorElement[]) => {
        return elements.map((element) => {
          const gameName: HTMLSpanElement | null = element.querySelector(
            "div.search_name span.title"
          );
          const gameDiscount: HTMLDivElement | null =
            element.querySelector("div.discount_pct");
          const gameFinalPrice: HTMLDivElement | null = element.querySelector(
            "div.discount_final_price"
          );
          const originalPriceSelector = gameDiscount
            ? "discount_original_price"
            : "discount_final_price";
          const gameOriginalPrice: HTMLDivElement | null =
            element.querySelector(`div.${originalPriceSelector}`);
          return {
            gameName: gameName?.innerText,
            url: element.href,
            discount_percent: gameDiscount ? gameDiscount.innerText : "-",
            initial_price: gameOriginalPrice?.innerText,
            final_price: gameFinalPrice?.innerText,
          };
        });
      }
    );

    // return content;

    const games: GamePriceInfo[] = content
      .map((el) => {
        return { ...el, gameName: replaceSteam(el.gameName) };
      })
      .filter((game: GamePriceInfo) =>
        game.gameName?.toLowerCase().includes(query.trim().toLowerCase())
      );

    return {
      [this.name]: games,
    };
  }
}
