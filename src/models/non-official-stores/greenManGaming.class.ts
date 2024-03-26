import { BrowserContext } from "playwright";
import { parseUrl } from "../../utils/game";
import { Store } from "../store.class";

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

  async scrapeGames(context: BrowserContext, query: string): Promise<any> {
    const page = await context.newPage();
    await page.goto(this.modifyUrl(query));
    await page.waitForSelector(
      "section.search-list-section div.algolia-search-list div.tab-content"
    );
    // await page.waitForTimeout(5000);
    // await page.screenshot({ path: "jio.png" });

    const content = await page.evaluate(() => {
      let results: any = [];
      const notFound: HTMLSpanElement | null = document.querySelector(
        "ul#algolia-tab div#non-dlc-stats span.ais-Stats-text"
      );
      if (notFound && notFound.innerText === "0") {
        return "Not found in store";
      }
      //only games
      const urls: NodeListOf<HTMLLIElement> = document.querySelectorAll(
        "div[bind-compile-html=hits] div.ais-Hits li.ais-Hits-item"
      );
      //games & dlcs
      //   const urls: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("div.ais-Hits li.ais-Hits-item")

      for (let item of urls) {
        const gameName: HTMLParagraphElement | null = item.querySelector(
          "div.top-section p.prod-name"
        );

        const url: HTMLAnchorElement | null = item.querySelector(
          "div.module-content div.module a"
        );
        const gameDiscount: HTMLParagraphElement | null = item.querySelector(
          "div.prices-section div.discount p"
        );
        const gameFinalPrice: HTMLSpanElement | null = item.querySelector(
          "div.prices-section div.prices span.current-price"
        );
        const originalPriceSelector = gameDiscount
          ? "prev-price"
          : "current-price";
        const gameOriginalPrice: HTMLSpanElement | null = item.querySelector(
          `div.prices span.${originalPriceSelector}`
        );

        const game: any = {
          gameName: gameName?.innerText,
          url: url?.href,
          discount_percent: gameDiscount ? gameDiscount.innerText : "-",
          inital_price: gameOriginalPrice?.innerText,
          final_price: gameFinalPrice?.innerText,
        };

        results.push(game);
      }

      return results;
    });

    return content;

    //todo : algunos juegos contienen caracteres ej: s.t.a.l.k.e.r , en la query stalker, al momento de comparar, no devolvera bien los juegos
    const games = content.filter((game: any) =>
      game.gameName.toLowerCase().includes(query.trim().toLowerCase())
    );
    return { [this.name]: games };
  }
}
