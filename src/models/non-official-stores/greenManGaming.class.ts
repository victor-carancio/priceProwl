import { Page } from "playwright";
import { parseUrl } from "../../utils/game.utils";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";

export class GreenManGaming extends Store {
  constructor() {
    super(
      "Green man gaming",
      "https://www.greenmangaming.com/es/search/?query="
    );
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "%20");
    this.setUrl(this.getUrl() + queryUrl); // pc game
    return this.getUrl();
  }

  async scrapeGames(page: Page, query: string): Promise<StoreInfo> {
    await page.goto(this.modifyUrl(query));
    await page.waitForSelector(
      "section.search-list-section div.algolia-search-list div.tab-content"
    );

    const notFound = await page.evaluate(() => {
      const gamesFound: HTMLSpanElement | null = document.querySelector(
        "ul#algolia-tab div#non-dlc-stats span.ais-Stats-text"
      );
      return gamesFound?.innerText;
    });

    if (notFound === "0") {
      return { [this.name]: [] };
    }

    const content: GamePriceInfo[] = await page.$$eval(
      "div[bind-compile-html=hits] div.ais-Hits li.ais-Hits-item",
      (elements) => {
        return elements.map((el) => {
          const gameName: HTMLParagraphElement = el.querySelector(
            "div.top-section p.prod-name"
          )!;

          const url: HTMLAnchorElement = el.querySelector(
            "div.module-content div.module a"
          )!;
          const gameDiscount: HTMLParagraphElement | null = el.querySelector(
            "div.prices-section div.discount p"
          );
          const gameFinalPrice: HTMLSpanElement | null = el.querySelector(
            "div.prices-section div.prices span.current-price"
          );
          const originalPriceSelector = gameDiscount
            ? "prev-price"
            : "current-price";
          const gameOriginalPrice: HTMLSpanElement | null = el.querySelector(
            `div.prices span.${originalPriceSelector}`
          );

          return {
            gameName: gameName?.innerText,
            url: url?.href,
            discount_percent: gameDiscount ? gameDiscount.innerText : "-",
            initial_price: gameOriginalPrice?.innerText,
            final_price: gameFinalPrice?.innerText,
          };
        });
      }
    );

    // return content;

    //todo : algunos juegos contienen caracteres ej: s.t.a.l.k.e.r , en la query stalker, al momento de comparar, no devolvera bien los juegos
    const games: GamePriceInfo[] = content.filter((game: GamePriceInfo) =>
      game.gameName.toLowerCase().includes(query.trim().toLowerCase())
    );
    return { [this.name]: games };
  }
}
