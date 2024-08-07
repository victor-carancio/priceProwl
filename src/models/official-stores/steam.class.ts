import { Page } from "playwright";
import { parseUrl, replaceSteam } from "../../utils/game.utils";
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

  async scrapeGames(page: Page, query: string): Promise<StoreInfo> {
    await page.goto(this.modifyUrl(query));
    await page.waitForSelector("div.search_results");
    await this.changeLanguage(page);

    const notFound = await page.evaluate(() =>
      document.querySelector("div#search_resultsRows"),
    );
    if (!notFound) {
      return { [this.name]: [] };
    }

    const content: GamePriceInfo[] = await page.$$eval(
      "div#search_resultsRows a.search_result_row",
      (elements: HTMLAnchorElement[]) => {
        return elements.map((element) => {
          const gameName: HTMLSpanElement = element.querySelector(
            "div.search_name span.title",
          )!;
          const gameDiscount: HTMLDivElement | null =
            element.querySelector("div.discount_pct");
          const gameFinalPrice: HTMLDivElement | null = element.querySelector(
            "div.discount_final_price",
          );
          const originalPriceSelector = gameDiscount
            ? "discount_original_price"
            : "discount_final_price";
          const gameOriginalPrice: HTMLDivElement | null =
            element.querySelector(`div.${originalPriceSelector}`);
          return {
            gameName: gameName.innerText,
            url: element.href,
            discount_percent: gameDiscount ? gameDiscount.innerText : "-",
            initial_price: gameOriginalPrice?.innerText,
            final_price: gameFinalPrice?.innerText,
          };
        });
      },
    );

    const games: GamePriceInfo[] = content
      .map((el) => {
        return { ...el, gameName: replaceSteam(el.gameName) };
      })
      .filter((game) =>
        game.gameName.toLowerCase().includes(query.trim().toLowerCase()),
      )
      .filter(
        (game) =>
          !game.gameName.toLowerCase().includes("demo") &&
          !game.gameName.toLowerCase().includes("bundle") &&
          !game.gameName.toLowerCase().includes("teaser") &&
          !game.gameName.toLowerCase().includes("pack") &&
          !game.gameName.toLowerCase().includes("mod") &&
          (!game.initial_price?.toLowerCase().includes("free to play") ||
            !game.final_price?.toLocaleLowerCase().includes("gratuito")),
      )
      .filter((game) => game.initial_price && game.final_price);

    return {
      [this.name]: games,
    };
  }

  async scrapePriceGameFromUrl(page: Page, url: string, gameName: string) {
    await page.goto(url);

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    await this.changeLanguage(page);

    // await page.waitForTimeout(60 * 1000);
    const birthdaySelector = await page.evaluate(() =>
      document.querySelector("div.agegate_birthday_selector"),
    );
    if (birthdaySelector) {
      await page.locator("select#ageYear").selectOption("1994");
      await page.locator("a#view_product_page_btn span").click();
      await page.waitForSelector("div.game_purchase_action_bg");
    }

    const currPrice = await page.$$eval(
      "div.game_area_purchase_game",
      (element: HTMLDivElement[]) => {
        return element.map((el) => {
          const gameDiscount: HTMLDivElement | null =
            el.querySelector("div.discount_pct");

          const initialGamePrice: HTMLDivElement = gameDiscount
            ? el.querySelector("div.discount_original_price")!
            : el.querySelector("div.game_purchase_price")!;

          const finalGamePrice: HTMLDivElement = gameDiscount
            ? el.querySelector("div.discount_final_price")!
            : el.querySelector("div.game_purchase_price")!;

          const name: HTMLHeadingElement | null = el.querySelector("h1");

          return {
            name: name?.innerText,
            currPrice: {
              discount_percent: gameDiscount ? gameDiscount.innerText : "-",
              initial_price: initialGamePrice?.innerText.replace("$ ", "$"),
              final_price: finalGamePrice?.innerText.replace("$ ", "$"),
            },
          };
        });
      },
    );

    let correctName = currPrice.find(
      (element) => element.name === `Buy ${gameName}`,
    );

    if (!correctName) {
      correctName = { ...currPrice[0] };
    }

    const offerEndDate = await page.$eval(
      "div.game_area_purchase_game",
      (element: HTMLDivElement) => {
        const countDown = element.querySelector(
          "p.game_purchase_discount_countdown",
        );
        return countDown ? element.innerText : null;
      },
    );

    return {
      ...correctName!.currPrice,
      offerEndDate: this.offerDateFormat(offerEndDate!),
    };
  }

  private offerDateFormat(offer: string) {
    if (!offer) {
      return;
    }

    const regex = /(?:Offer ends|Termina el)\s(\d{1,2})\s(\w+)/i;
    const match = offer.match(regex);

    if (match) {
      const day = parseInt(match[1]);
      const monthName = match[2].toLowerCase();
      const monthNames = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      const monthIndex = monthNames.indexOf(monthName);

      if (monthIndex !== -1) {
        const year = new Date().getFullYear();

        const date = new Date(year, monthIndex, day);
        return date.toISOString();
      }
    }
    return;
  }

  private async changeLanguage(page: Page) {
    const currContext = page.context();

    const cookiesInContext = await currContext.cookies();

    if (
      !cookiesInContext.some(
        (cookie) =>
          cookie.domain === "store.steampowered.com" &&
          cookie.name === "Steam_Language" &&
          cookie.value === "english",
      )
    ) {
      await currContext.addCookies([
        {
          domain: "store.steampowered.com",
          name: "Steam_Language",
          value: "english",
          path: "/",
        },
      ]);
      await page.reload();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
    }
  }
}
