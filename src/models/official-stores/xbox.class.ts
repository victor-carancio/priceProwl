import { Page } from "playwright";
import { parseUrl, replaceSteam, replaceXbox } from "../../utils/game.utils";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";

export class XboxStore extends Store {
  constructor() {
    super("Xbox", "https://www.xbox.com/en-US/search/results/games?q=");
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
            "span.Price-module__boldText___1i2Li.Price-module__moreText___sNMVr.ProductCard-module__price___cs1xr",
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

    // await page.waitForSelector(
    //   "div.ProductActionsPanel-module__desktopProductActionsPanel___J1Jn3",
    // );
    await page.waitForLoadState("networkidle");

    const notFound = await page.evaluate(() =>
      document.querySelector("div.ErrorPage-module__errorContainer___DRsEx"),
    );

    if (notFound) {
      return null;
    }

    // await page.waitForSelector(
    //   "div.ModuleRow-module__row___N1V3E.ProductDetailsHeader-module__tagsContainerDesktop___6K0K8.ProductDetailsHeader-module__hideOnMobileView___6l6Ro",
    // );
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
        //  ? "span.Price-module__brandOriginalPrice___hNhzI"
        const originalPriceSelector: string = document.querySelector(
          "span.Price-module__brandOriginalPrice___ayJAn",
        )
          ? "span.Price-module__brandOriginalPrice___ayJAn"
          : "span.Price-module__boldText___vmNHu.Price-module__moreText___q5KoT";

        const initialGamePrice: HTMLSpanElement | null =
          element.querySelector(
            "button.CommonButtonStyles-module__variableLineDesktopButton___cxDyV.CommonButtonStyles-module__highContrastAwareButton___DgX7Y span",
          ) || gamepass
            ? element.querySelector(
                "button.CommonButtonStyles-module__variableLineDesktopButton___cxDyV.CommonButtonStyles-module__highContrastAwareButton___DgX7Y span",
              )
            : element.querySelector(originalPriceSelector);

        const finalGamePrice: HTMLDivElement | null = element.querySelector(
          "span.Price-module__boldText___1i2Li.Price-module__moreText___sNMVr.AcquisitionButtons-module__listedPrice___PS6Zm",
        );

        return {
          gamepass: gamepass ? true : false,
          discount_percent:
            !finalGamePrice ||
            initialGamePrice!.innerText.replace(/[^0-9.]/g, "") ===
              finalGamePrice.innerText.replace(/[^0-9.]/g, "")
              ? "-"
              : calculateDiscountPercent(
                  initialGamePrice!.innerText,
                  finalGamePrice.innerText,
                ),
          initial_price: initialGamePrice!.innerText,
          final_price: finalGamePrice
            ? finalGamePrice.innerText
            : initialGamePrice?.innerText || "-",
        };
      },
    );

    const offerEndDate = await page.$eval(
      "div.ModuleRow-module__row___N1V3E.ProductDetailsHeader-module__tagsContainerDesktop___6K0K8.ProductDetailsHeader-module__hideOnMobileView___6l6Ro",
      (element: HTMLDivElement) => {
        const iconOffer: HTMLDivElement | null = element.querySelector(
          "svg.TagIcon-module__icon___idvrW.TagIcon-module__primaryIcon___kF7Ys.ProductTags-module__salesTagIcon___YZ-rE.Icon-module__icon___6ICyA",
        );

        const offerDate: ChildNode | null = iconOffer
          ? iconOffer.nextSibling
          : null;

        return offerDate ? offerDate.textContent : null;
      },
    );

    return { ...currPrice, offerEndDate: this.offerDateFormat(offerEndDate!) };
  }

  private offerDateFormat = (offer: string) => {
    if (!offer) {
      return;
    }

    const regex = /(?:finaliza en|ends in)\s(\d+)\s(?:días|days)/i;
    const match = offer.match(regex);

    if (match) {
      const days = parseInt(match[1]);

      const currentDate = new Date();

      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + days);

      return endDate.toISOString();
    }
    return;
  };
}
