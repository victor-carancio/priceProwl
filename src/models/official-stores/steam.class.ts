// import { Page } from "playwright";
import { parseUrl, replaceSteam } from "../../utils/game.utils";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";
import { SteamAppsSearch, SteamSearch, SteamSearchImg } from "../types";
import { formatToDecimals } from "../utils.model";

//https://github.com/Revadike/InternalSteamWebAPI/wiki/Get-App-Details
//https://github.com/Revadike/InternalSteamWebAPI/wiki/Search-Apps

export class SteamStore extends Store {
  constructor() {
    super("Steam");
  }

  private searchUrl(term: string) {
    const queryParsed = parseUrl(term, "%20");
    return `https://steamcommunity.com/actions/SearchApps/${queryParsed}`;
  }

  async scrapeGamesFromSearch(
    query: string,
    currency: string,
  ): Promise<StoreInfo> {
    const res = await fetch(this.searchUrl(query));
    const gamesInfo: SteamAppsSearch[] = await res.json();

    if (gamesInfo.length <= 0) {
      return { store: this.name, type: this.type, storeInfo: [] };
    }

    const onlyIds = gamesInfo.map((game) => game.appid).join(",");

    const detailRes = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${onlyIds}&filters=price_overview&cc=${currency}`,
    );
    const detailData: SteamSearch = await detailRes.json();

    const formatedData: GamePriceInfo[] = [];

    for (const game of gamesInfo) {
      const { appid, name } = game;
      if (
        "data" in detailData[appid] &&
        "price_overview" in detailData[appid].data
      ) {
        const gamePrices = { ...detailData[appid].data.price_overview };
        const {
          initial,
          currency: currencyStore,
          discount_percent,
          final,
        } = gamePrices;

        const urlTitle = parseUrl(name, "_");

        const imgRes = await fetch(
          `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=${currency}`,
        );
        const imgData: SteamSearchImg = await imgRes.json();
        const data = {
          storeId: appid,
          gameName: name,
          url: `https://store.steampowered.com/app/${appid}/${urlTitle}/`,
          imgStore: imgData[appid].data.header_image,
          discount_percent: discount_percent.toFixed(),
          currency: currencyStore,
          initial_price:
            currency === "CL"
              ? formatToDecimals(initial, 2)
              : initial.toFixed(),
          final_price:
            currency === "CL" ? formatToDecimals(final, 2) : final.toFixed(),
        };
        formatedData.push(data);
      }
    }

    const games = formatedData.map((el) => {
      return { ...el, gameName: replaceSteam(el.gameName) };
    });

    return { store: this.name, type: this.type, storeInfo: games };
  }
  // https://store.steampowered.com/api/appdetails?appids=${onlyIds}&filters=price_overview&cc=${currency}
  async scrapeGameFromUrl(storeId: string) {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${storeId}&filters=price_overview&cc=CL`,
    );
    const data: SteamSearch = await res.json();

    if (storeId in data) {
      const { currency, discount_percent, initial, final } =
        data[storeId].data.price_overview;

      return {
        offerEndDate: null,
        currency: currency,
        discount_percent: discount_percent.toFixed(),
        initial_price: formatToDecimals(initial, 2),
        final_price: formatToDecimals(final, 2),
      };
    }
    return null;
  }

  // async scrapePriceGameFromUrl(page: Page, url: string, gameName: string) {
  //   await page.goto(url);

  //   await page.waitForLoadState("domcontentloaded");
  //   await page.waitForTimeout(500);

  //   await this.changeLanguage(page);

  //   // await page.waitForTimeout(60 * 1000);
  //   const birthdaySelector = await page.evaluate(() =>
  //     document.querySelector("div.agegate_birthday_selector"),
  //   );
  //   if (birthdaySelector) {
  //     await page.locator("select#ageYear").selectOption("1994");
  //     await page.locator("a#view_product_page_btn span").click();
  //     await page.waitForSelector("div.game_purchase_action_bg");
  //   }

  //   const currPrice = await page.$$eval(
  //     "div.game_area_purchase_game",
  //     (element: HTMLDivElement[]) => {
  //       return element.map((el) => {
  //         const gameDiscount: HTMLDivElement | null =
  //           el.querySelector("div.discount_pct");

  //         const initialGamePrice: HTMLDivElement = gameDiscount
  //           ? el.querySelector("div.discount_original_price")!
  //           : el.querySelector("div.game_purchase_price")!;

  //         const finalGamePrice: HTMLDivElement = gameDiscount
  //           ? el.querySelector("div.discount_final_price")!
  //           : el.querySelector("div.game_purchase_price")!;

  //         const name: HTMLHeadingElement | null = el.querySelector("h1");

  //         return {
  //           name: name?.innerText,
  //           currPrice: {
  //             discount_percent: gameDiscount ? gameDiscount.innerText : "-",
  //             initial_price: initialGamePrice?.innerText.replace("$ ", "$"),
  //             final_price: finalGamePrice?.innerText.replace("$ ", "$"),
  //           },
  //         };
  //       });
  //     },
  //   );

  //   let correctName = currPrice.find(
  //     (element) => element.name === `Buy ${gameName}`,
  //   );

  //   if (!correctName) {
  //     correctName = { ...currPrice[0] };
  //   }

  //   const offerEndDate = await page.$eval(
  //     "div.game_area_purchase_game",
  //     (element: HTMLDivElement) => {
  //       const countDown = element.querySelector(
  //         "p.game_purchase_discount_countdown",
  //       );
  //       return countDown ? element.innerText : null;
  //     },
  //   );

  //   return {
  //     ...correctName!.currPrice,
  //     offerEndDate: this.offerDateFormat(offerEndDate!),
  //   };
  // }

  // private offerDateFormat(offer: string) {
  //   if (!offer) {
  //     return;
  //   }

  //   const regex = /(?:Offer ends|Termina el)\s(\d{1,2})\s(\w+)/i;
  //   const match = offer.match(regex);

  //   if (match) {
  //     const day = parseInt(match[1]);
  //     const monthName = match[2].toLowerCase();
  //     const monthNames = [
  //       "january",
  //       "february",
  //       "march",
  //       "april",
  //       "may",
  //       "june",
  //       "july",
  //       "august",
  //       "september",
  //       "october",
  //       "november",
  //       "december",
  //     ];
  //     const monthIndex = monthNames.indexOf(monthName);

  //     if (monthIndex !== -1) {
  //       const year = new Date().getFullYear();

  //       const date = new Date(year, monthIndex, day);
  //       return date.toISOString();
  //     }
  //   }
  //   return;
  // }

  // private async changeLanguage(page: Page) {
  //   const currContext = page.context();

  //   const cookiesInContext = await currContext.cookies();

  //   if (
  //     !cookiesInContext.some(
  //       (cookie) =>
  //         cookie.domain === "store.steampowered.com" &&
  //         cookie.name === "Steam_Language" &&
  //         cookie.value === "english",
  //     )
  //   ) {
  //     await currContext.addCookies([
  //       {
  //         domain: "store.steampowered.com",
  //         name: "Steam_Language",
  //         value: "english",
  //         path: "/",
  //       },
  //     ]);
  //     await page.reload();
  //     await page.waitForLoadState("domcontentloaded");
  //     await page.waitForTimeout(500);
  //   }
  // }
}
