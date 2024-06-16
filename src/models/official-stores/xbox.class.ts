import { Page } from "playwright";
import { parseUrl, replaceSteam, replaceXbox } from "../../utils/game.utils";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";

export class XboxStore extends Store {
  constructor() {
    super("Xbox", "https://www.xbox.com/en-CL/search/results/games?q=");
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "+");
    this.setUrl(this.getUrl() + queryUrl + "&PlayWith=PC"); // pc game
    return this.getUrl();
  }

  async scrapeGames(page: Page, query: string): Promise<StoreInfo> {
    await page.goto(this.modifyUrl(query));

    await page.waitForSelector("div.SearchTabs-module__tabContainer___MR492");

    const notFound = await page.evaluate(() =>
      document.querySelector("h4.ErrorWithImage-module__errorHeading___xEheO"),
    );

    if (notFound) {
      return { [this.name]: [] };
    }

    const content: GamePriceInfo[] = await page.$$eval(
      "div.ProductCard-module__cardWrapper___6Ls86",
      (elements) => {
        return elements.map((element) => {
          const gameName: HTMLDivElement = element.querySelector(
            "div.ProductCard-module__infoBox___M5x18 span",
          )!;
          const url: HTMLAnchorElement = element.querySelector(
            "a.commonStyles-module__basicButton___go-bX",
          )!;
          const gameDiscount: HTMLDivElement | null = element.querySelector(
            "div.ProductCard-module__discountTag___OjGFy",
          );
          const gameFinalPrice: HTMLSpanElement | null = element.querySelector(
            "span.Price-module__listedDiscountPrice___67yG1",
          );
          const originalPriceSelector = gameDiscount
            ? ""
            : ".Price-module__moreText___q5KoT";
          const gameOriginalPrice: HTMLSpanElement | null =
            element.querySelector(
              `div.typography-module__xdsBody2___RNdGY span${originalPriceSelector}`,
            );
          const gamePass: HTMLTitleElement | null = element.querySelector(
            "svg.SubscriptionBadge-module__gamePassBadge___ukbVg title",
          );
          return {
            gameName: gameName.innerText,
            url: url.href,
            discount_percent: gameDiscount ? gameDiscount.innerText : "-",
            initial_price: gameOriginalPrice?.innerText,
            final_price: gameFinalPrice
              ? gameFinalPrice?.innerText
              : gameOriginalPrice?.innerText,
            gamepass: gamePass ? true : false,
          };
        });
      },
    );

    // return content;

    const games: GamePriceInfo[] = content
      .map((el) => {
        return { ...el, gameName: replaceSteam(replaceXbox(el.gameName)) };
      })
      .filter((game: GamePriceInfo) =>
        game.gameName.toLowerCase().includes(query.trim().toLowerCase()),
      )
      .filter((game) => game.initial_price && game.final_price)
      .filter((game) => !game.gameName.toLowerCase().includes("xbox"));

    return { [this.name]: games };
  }

  async scrapePriceGameFromUrl(page: Page, url: string) {
    await page.goto(url);

    await page.waitForSelector(
      "div.ProductActionsPanel-module__desktopProductActionsPanel___J1Jn3",
    );
    await page.waitForTimeout(500);

    const currPrice = await page.$eval(
      "div.ProductActionsPanel-module__desktopProductActionsPanel___J1Jn3",
      (element: HTMLDivElement) => {
        const calculateDiscountPercent = (
          initial_price: string,
          final_price: string,
        ) => {
          const initial = Number(initial_price?.replace(/[^0-9.]/g, "")) * 100;
          const final = Number(final_price?.replace(/[^0-9.]/g, "")) * 100;

          const discount: number = (final / initial) * 100 - 100;

          return Math.round(discount).toFixed() + "%";
        };

        const gamepass: HTMLSpanElement | null = element.querySelector(
          "span.glyph-prepend.glyph-prepend-xbox-game-pass-inline",
        );

        const originalPriceSelector: string = document.querySelector(
          "span.Price-module__brandOriginalPrice___hNhzI",
        )
          ? "span.Price-module__brandOriginalPrice___hNhzI"
          : "span.Price-module__boldText___vmNHu.Price-module__moreText___q5KoT";

        const initialGamePrice: HTMLSpanElement | null = gamepass
          ? element.querySelector(
              "button.CommonButtonStyles-module__variableLineDesktopButton___cxDyV.CommonButtonStyles-module__highContrastAwareButton___DgX7Y span",
            )
          : element.querySelector(originalPriceSelector);

        const finalGamePrice: HTMLDivElement | null = element.querySelector(
          "span.Price-module__boldText___vmNHu.Price-module__moreText___q5KoT",
        );

        return {
          gamepass: gamepass ? true : false,
          discount_percent:
            initialGamePrice!.innerText.replace(/[^0-9.]/g, "") ===
            finalGamePrice!.innerText.replace(/[^0-9.]/g, "")
              ? "-"
              : calculateDiscountPercent(
                  initialGamePrice!.innerText,
                  finalGamePrice!.innerText,
                ),
          initial_price: initialGamePrice!.innerText,
          final_price: finalGamePrice!.innerText,
        };
      },
    );
    return currPrice;
  }
}
