import { Page } from "playwright";
import { parseUrl } from "../../utils/game";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";

export class EpicStore extends Store {
  constructor() {
    super("Epic", "https://store.epicgames.com/es-ES/browse?q=");
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "%20");
    this.setUrl(
      this.getUrl() +
        queryUrl +
        "&sortBy=relevancy&sortDir=DESC&category=Game&count=40&start=0"
    ); // pc game
    return this.getUrl();
  }

  async scrapeGames(page: Page, query: string): Promise<StoreInfo | []> {
    await page.goto(this.modifyUrl(query));

    // await page.waitForTimeout(1000);
    await page.waitForSelector("section.css-1ufzxyu");

    const notFound = await page.evaluate(() =>
      document.querySelector("div.css-17qmv99 div.css-1dbkmxi")
    );

    if (notFound) {
      return { [this.name]: [] };
    }

    const content: GamePriceInfo[] = await page.$$eval(
      "div.css-2mlzob",
      (elements) => {
        return elements.map((element) => {
          const gameName: HTMLDivElement | null =
            element.querySelector("div.css-lgj0h8 div");
          const url: HTMLAnchorElement | null =
            element.querySelector("a.css-g3jcms");
          const gameType: HTMLSpanElement | null = element.querySelector(
            "span.css-1825rs2 span"
          );
          const gameDiscount: HTMLDivElement | null =
            element.querySelector("div.css-1q7f74q");
          const gameFinalPrice: HTMLSpanElement | null = element.querySelector(
            "div.css-l24hbj span.css-119zqif"
          );
          const gameOriginalPrice: HTMLDivElement | null =
            element.querySelector("span.css-d3i3lr div.css-4jky3p");

          return {
            gameName: gameName?.innerText,
            typeS: gameType?.innerText,
            url: url?.href,
            discount_percent: gameDiscount ? gameDiscount.innerText : "-",
            initial_price: gameDiscount
              ? gameOriginalPrice?.innerText
              : gameFinalPrice?.innerText,
            final_price: gameFinalPrice?.innerText,
          };
        });
      }
    );

    // return content;

    const games: GamePriceInfo[] = content.filter((game: GamePriceInfo) =>
      game.gameName?.toLowerCase().includes(query.trim().toLowerCase())
    );
    return { [this.name]: games };
  }
}
