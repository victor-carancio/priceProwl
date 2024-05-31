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

    const notFound = await page.evaluate(() =>
      document.querySelector("div#search_resultsRows")
    );
    if (!notFound) {
      return { [this.name]: [] };
    }

    const content: GamePriceInfo[] = await page.$$eval(
      "div#search_resultsRows a.search_result_row",
      (elements: HTMLAnchorElement[]) => {
        return elements.map((element) => {
          const gameName: HTMLSpanElement = element.querySelector(
            "div.search_name span.title"
          )!;
          const gameDiscount: HTMLDivElement | null =
            element.querySelector("div.discount_pct");
          const gameFinalPrice: HTMLDivElement | null = element.querySelector(
            "div.discount_final_price"
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
      }
    );

    const games: GamePriceInfo[] = content
      .map((el) => {
        return { ...el, gameName: replaceSteam(el.gameName) };
      })
      .filter((game) =>
        game.gameName.toLowerCase().includes(query.trim().toLowerCase())
      )
      .filter(
        (game) =>
          !game.gameName.toLowerCase().includes("demo") ||
          !game.gameName.toLowerCase().includes("bundle") ||
          !game.gameName.toLowerCase().includes("teaser") ||
          !game.gameName.toLowerCase().includes("pack")
      );

    return {
      [this.name]: games,
    };
  }

  async scrapePriceGameFromUrl(page: Page, url: string) {
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const birthdaySelector = await page.evaluate(() =>
      document.querySelector("div.agegate_birthday_selector")
    );
    if (birthdaySelector) {
      await page.locator("select#ageYear").selectOption("1994");
      await page.locator("a#view_product_page_btn span").click();
      await page.waitForSelector("div.game_purchase_action_bg");
    }

    const currPrice = await page.$eval(
      "div.game_purchase_action_bg",
      (element: HTMLDivElement) => {
        const gameDiscount: HTMLDivElement | null =
          element.querySelector("div.discount_pct");

        const initialGamePrice: HTMLDivElement = gameDiscount
          ? element.querySelector("div.discount_original_price")!
          : element.querySelector("div.game_purchase_price")!;

        const finalGamePrice: HTMLDivElement = gameDiscount
          ? element.querySelector("div.discount_final_price")!
          : element.querySelector("div.game_purchase_price")!;

        return {
          discount_percent: gameDiscount ? gameDiscount.innerText : "-",
          initial_price: initialGamePrice?.innerText.replace("$ ", "$"),
          final_price: finalGamePrice?.innerText.replace("$ ", "$"),
        };
      }
    );
    return currPrice;
  }
}
