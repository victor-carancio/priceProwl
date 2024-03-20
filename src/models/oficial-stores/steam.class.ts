import { BrowserContext } from "playwright";
import { parseUrl } from "../../utils/game";
import { Store } from "../store.class";

export class SteamStore extends Store {
  constructor() {
    super("Steam", "https://store.steampowered.com/search/?term=");
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "+");
    this.setUrl(this.getUrl() + queryUrl + "&category1=998&ndl=1"); // pc game
    return this.getUrl();
  }

  async scrapeGames(context: BrowserContext, query: string): Promise<any> {
    const page = await context.newPage();
    await page.goto(this.modifyUrl(query));
    await page.waitForSelector("div.search_results");

    const content = await page.evaluate(() => {
      let results: any = [];
      const notFound = document.querySelector("div#search_resultsRows");
      if (!notFound) {
        return "Not found in store";
      }
      const urls: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
        "div#search_resultsRows a.search_result_row"
      );

      for (let item of urls) {
        const gameName: HTMLSpanElement | null = item.querySelector(
          "div.search_name span.title"
        );
        const gameDiscount: HTMLDivElement | null =
          item.querySelector("div.discount_pct");
        const gameFinalPrice: HTMLDivElement | null = item.querySelector(
          "div.discount_final_price"
        );
        const originalPriceSelector = gameDiscount
          ? "discount_original_price"
          : "discount_final_price";
        const gameOriginalPrice: HTMLDivElement | null = item.querySelector(
          `div.${originalPriceSelector}`
        );

        const game: any = {
          gameName: gameName?.innerText,
          url: item.href,
          discount_percent: gameDiscount ? gameDiscount.innerText : "-",
          inital_price: gameOriginalPrice?.innerText,
          final_price: gameFinalPrice?.innerText,
        };

        results.push(game);
      }

      return results;
    });

    const games = content.filter((game: any) =>
      game.gameName.toLowerCase().includes(query.trim().toLowerCase())
    );
    return { [this.name]: games };
  }
}
