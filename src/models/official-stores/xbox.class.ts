import { Page } from "playwright";
import { parseUrl, replaceXbox } from "../../utils/game";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";

export class XboxStore extends Store {
  constructor() {
    super("Xbox", "https://www.xbox.com/es-CL/search/results/games?q=");
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "+");
    this.setUrl(this.getUrl() + queryUrl + "&PlayWith=PC"); // pc game
    return this.getUrl();
  }

  async scrapeGames(page: Page, query: string): Promise<StoreInfo | []> {
    await page.goto(this.modifyUrl(query));

    await page.waitForSelector("div.SearchTabs-module__tabContainer___MR492");

    const notFound = await page.evaluate(() =>
      document.querySelector("h4.ErrorWithImage-module__errorHeading___xEheO")
    );

    if (notFound) {
      return [];
    }

    const content: GamePriceInfo[] = await page.$$eval(
      "div.ProductCard-module__cardWrapper___6Ls86",
      (elements) => {
        return elements.map((element) => {
          const gameName: HTMLDivElement | null = element.querySelector(
            "div.ProductCard-module__infoBox___M5x18 span"
          );
          const url: HTMLAnchorElement | null = element.querySelector(
            "a.commonStyles-module__basicButton___go-bX"
          );
          const gameDiscount: HTMLDivElement | null = element.querySelector(
            "div.ProductCard-module__discountTag___OjGFy"
          );
          const gameFinalPrice: HTMLSpanElement | null = element.querySelector(
            "span.Price-module__listedDiscountPrice___67yG1"
          );
          const originalPriceSelector = gameDiscount
            ? ""
            : ".Price-module__moreText___q5KoT";
          const gameOriginalPrice: HTMLSpanElement | null =
            element.querySelector(
              `div.typography-module__xdsBody2___RNdGY span${originalPriceSelector}`
            );
          const gamePass: HTMLTitleElement | null = element.querySelector(
            "svg.SubscriptionBadge-module__gamePassBadge___ukbVg title"
          );
          return {
            gameName: gameName?.innerText,
            url: url?.href,
            discount_percent: gameDiscount ? gameDiscount.innerText : "-",
            initial_price: gameOriginalPrice?.innerText,
            final_price: gameFinalPrice
              ? gameFinalPrice?.innerText
              : gameOriginalPrice?.innerText,
            gamepass: gamePass ? true : false,
          };
        });
      }
    );

    // return content;

    const games: GamePriceInfo[] = content
      .filter((game: GamePriceInfo) =>
        game.gameName?.toLowerCase().includes(query.trim().toLowerCase())
      )
      .map((el) => {
        return { ...el, gameName: replaceXbox(el.gameName) };
      });
    return { [this.name]: games };
  }
}
