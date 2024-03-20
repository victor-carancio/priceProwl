import { BrowserContext } from "playwright";
import { parseUrl } from "../../utils/game";
import { Store } from "../store.class";

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

  async scrapeGames(context: BrowserContext, query: string): Promise<any> {
    const page = await context.newPage();
    await page.goto(this.modifyUrl(query));
    // await page.waitForSelector("div.css-uwwqev") imagen
    await page.waitForSelector("section.css-1ufzxyu");

    const content = await page.evaluate(() => {
      let results: any = [];
      const notFound = document.querySelector(
        "div.css-17qmv99 div.css-1dbkmxi"
      );
      if (notFound) {
        return "Not found in store";
      }
      const urls: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll("div.css-2mlzob a");
      for (let item of urls) {
        const gameName: HTMLDivElement | null =
          item.querySelector("div.css-lgj0h8 div");
        const gameType: HTMLSpanElement | null = item.querySelector(
          "span.css-1825rs2 span"
        );
        const gameDiscount: HTMLDivElement | null =
          item.querySelector("div.css-1q7f74q");
        const gameFinalPrice: HTMLSpanElement | null = item.querySelector(
          "div.css-l24hbj span.css-119zqif"
        );
        const gameOriginalPrice: HTMLDivElement | null = item.querySelector(
          "span.css-d3i3lr div.css-4jky3p"
        );

        const game: any = {
          gameName: gameName?.innerText,
          typeS: gameType?.innerText,
          url: item.href,
          discount_percent: gameDiscount ? gameDiscount.innerText : "-",
          inital_price: gameDiscount
            ? gameOriginalPrice?.innerText
            : gameFinalPrice?.innerText,
          final_price: gameFinalPrice?.innerText,
        };

        results.push(game);
      }
      console.log(results);
      return results;
    });

    const games = content.filter((game: any) =>
      game.gameName.toLowerCase().includes(query.trim().toLowerCase())
    );
    return { [this.name]: games };
  }
}
