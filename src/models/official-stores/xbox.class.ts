import { BrowserContext } from "playwright";
import { parseUrl } from "../../utils/game";
import { Store } from "../store.class";

export class XboxStore extends Store {
  constructor() {
    super("Xbox", "https://www.xbox.com/es-CL/search/results/games?q=");
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "+");
    this.setUrl(this.getUrl() + queryUrl + "&PlayWith=PC"); // pc game
    return this.getUrl();
  }

  async scrapeGames(context: BrowserContext, query: string): Promise<any> {
    console.log(query.toLowerCase().trim());
    const page = await context.newPage();
    await page.goto(this.modifyUrl(query));
    await page.waitForSelector("div.SearchTabs-module__tabContainer___MR492");

    const content = await page.evaluate(() => {
      let results: any = [];
      const urls: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
        "div.ProductCard-module__cardWrapper___6Ls86 a"
      );

      for (let item of urls) {
        const gameName: HTMLDivElement | null = item.querySelector(
          "div.ProductCard-module__infoBox___M5x18 span"
        );
        const gameDiscount: HTMLDivElement | null = item.querySelector(
          "div.ProductCard-module__discountTag___OjGFy"
        );
        const gameFinalPrice: HTMLSpanElement | null = item.querySelector(
          "span.Price-module__listedDiscountPrice___67yG1"
        );
        const originalPriceSelector = gameDiscount
          ? ""
          : ".Price-module__moreText___q5KoT";
        const gameOriginalPrice: HTMLSpanElement | null = item.querySelector(
          `div.typography-module__xdsBody2___RNdGY span${originalPriceSelector}`
        );
        const gamePass: HTMLTitleElement | null = item.querySelector(
          "svg.SubscriptionBadge-module__gamePassBadge___ukbVg title"
        );

        const game: any = {
          gameName: gameName?.innerText,
          url: item.href,
          discount_percent: gameDiscount ? gameDiscount.innerText : "-",
          inital_price: gameOriginalPrice?.innerText,
          final_price: gameFinalPrice
            ? gameFinalPrice?.innerText
            : gameOriginalPrice?.innerText,
          gamepass: gamePass ? true : false,
        };

        results.push(game);
      }

      return results;
    });

    return content;

    const games = content.filter((game: any) =>
      game.gameName.toLowerCase().includes(query.trim().toLowerCase())
    );
    return { [this.name]: games };
  }
}
