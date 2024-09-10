import { calculateDiscountPercent, formatToDecimals } from "./../utils.model";
// import { Page } from "playwright";
import { parseUrl, replaceSteam } from "../../utils/game.utils";
import { Store } from "../store.class";
import { StoreInfo } from "../../types";
import { CustomApiError } from "../../responses/customApiError";
import { EpicOffer, EpicSearch } from "../types";

export class EpicStore extends Store {
  constructor() {
    super("Epic");
  }

  private searchUrl = (term: string, currency: string) => {
    const queryTerm = parseUrl(term, "+");

    return `https://store.epicgames.com/graphql?operationName=searchStoreQuery&variables=%7B%22allowCountries%22:%22CL%22,%22category%22:%22games%2Fedition%2Fbase%22,%22count%22:40,%22country%22:%22${currency}%22,%22keywords%22:%22${queryTerm}%22,%22locale%22:%22en-EN%22,%22sortBy%22:%22relevancy,viewableDate%22,%22sortDir%22:%22DESC,DESC%22,%22start%22:0,%22tag%22:%22%22,%22withPrice%22:true%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%227d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437%22%7D%7D`;
  };

  private offerEndDate(lineOffers: EpicOffer): string | null {
    if (lineOffers.appliedRules.length > 0) {
      return lineOffers.appliedRules[0].endDate!;
    }
    return null;
  }

  async scrapeGamesFromSearch(
    term: string,
    currency: string,
  ): Promise<StoreInfo> {
    const res = await fetch(this.searchUrl(term, currency));
    if (!res.ok) {
      throw new CustomApiError("Something went wrong.");
    }
    const data = await res.json();

    if (data.data.Catalog.searchStore.elements.length <= 0) {
      return { store: this.name, type: this.type, storeInfo: [] };
    }
    const currData: EpicSearch[] = [...data.data.Catalog.searchStore.elements];
    // return currData;

    const formatedData = currData.map((element) => {
      const { title, id, price, catalogNs, keyImages, namespace } = element;
      const {
        originalPrice,
        discountPrice,
        currencyInfo,
        discount,
        currencyCode,
      } = price.totalPrice;

      const urlTitle = catalogNs.mappings[0].pageSlug;

      return {
        storeId: `${id},${namespace}`,
        gameName: title,
        url: `https://store.epicgames.com/es-ES/p/${urlTitle}`,
        imgStore: keyImages[0].url,
        discount_percent: calculateDiscountPercent(originalPrice, discount),
        currency: currencyCode,
        initial_price: formatToDecimals(originalPrice, currencyInfo.decimals),
        final_price: formatToDecimals(discountPrice, currencyInfo.decimals),
      };
    });
    console.log();
    // return formatedData;
    const games = formatedData
      .map((el) => {
        return { ...el, gameName: replaceSteam(el.gameName) };
      })

      // .filter((game) =>
      //   game.gameName.toLowerCase().includes(term.trim().toLowerCase()),
      // )
      .filter(
        (game) =>
          game.initial_price &&
          game.final_price &&
          game.initial_price !== "0" &&
          game.final_price !== "0",
      );
    return { store: this.name, type: this.type, storeInfo: games };
  }

  async scrapeGameFromUrl(storeId: string) {
    const manipulateId = storeId.split(",");
    const id = manipulateId[0];
    const nameSpace = manipulateId[1];

    const res = await fetch(
      `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22es-ES%22,%22country%22:%22CL%22,%22offerId%22:%22${id}%22,%22sandboxId%22:%22${nameSpace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22abafd6e0aa80535c43676f533f0283c7f5214a59e9fae6ebfb37bed1b1bb2e9b%22%7D%7D`,
    );
    const data = await res.json();

    // return data;
    const currData: EpicSearch = { ...data.data.Catalog.catalogOffer };

    const {
      currencyCode,
      discount,
      currencyInfo,
      discountPrice,
      originalPrice,
    } = currData.price.totalPrice;
    const { lineOffers } = currData.price;

    return {
      offerEndDate: this.offerEndDate(lineOffers[0]),
      currency: currencyCode,
      discount_percent: calculateDiscountPercent(originalPrice, discount),
      initial_price: formatToDecimals(originalPrice, currencyInfo.decimals),
      final_price: formatToDecimals(discountPrice, currencyInfo.decimals),
    };
  }

  // async scrapePriceGameFromUrl(page: Page, url: string) {
  //   await page.goto(url);
  //   await page.waitForLoadState("domcontentloaded");
  //   await page.waitForTimeout(500);

  //   const birthdaySelector = await page.evaluate(() =>
  //     document.querySelector("div[data-testid=AgeSelect]"),
  //   );
  //   if (birthdaySelector) {
  //     //day
  //     await page.locator("button.css-19ah1ww#day_toggle").click();
  //     await page.waitForSelector("ul#day_menu");
  //     await page
  //       .locator("ul#day_menu li.css-1vf7hpq span.css-23anny", {
  //         hasText: "01",
  //       })
  //       .click();
  //     await page.waitForTimeout(500);
  //     //month
  //     await page.locator("button.css-19ah1ww#month_toggle").click();
  //     await page.waitForSelector("ul#month_menu");
  //     await page
  //       .locator("ul#month_menu li.css-1vf7hpq span.css-23anny", {
  //         hasText: "01",
  //       })
  //       .click();
  //     await page.waitForTimeout(500);
  //     //year
  //     await page.locator("button.css-19ah1ww#year_toggle").click();
  //     await page.waitForSelector("ul#year_menu");
  //     await page
  //       .locator("ul#year_menu li.css-1vf7hpq span.css-23anny", {
  //         hasText: "1994",
  //       })
  //       .click();
  //     await page.waitForTimeout(500);
  //     await page.locator("button#btn_age_continue").click();

  //     await page.waitForLoadState("domcontentloaded");
  //   }

  //   const currPrice = await page.$eval(
  //     "div.css-169q7x3",
  //     (element: HTMLDivElement) => {
  //       const gameDiscount: HTMLDivElement | null = element.querySelector(
  //         "div.css-169q7x3 span.css-1kn2h2p div",
  //       );

  //       const initialGamePrice: HTMLDivElement = gameDiscount
  //         ? element.querySelector(
  //             "div.css-l24hbj span.css-d3i3lr div.css-4jky3p",
  //           )!
  //         : element.querySelector("div.css-l24hbj span.css-119zqif")!;

  //       const finalGamePrice: HTMLDivElement = element.querySelector(
  //         "div.css-l24hbj span.css-119zqif",
  //       )!;

  //       return {
  //         discount_percent: gameDiscount ? gameDiscount.innerText : "-",
  //         initial_price: initialGamePrice.innerText,
  //         final_price: finalGamePrice.innerText,
  //       };
  //     },
  //   );
  //   //css-j7qwjs
  //   const offerEndDate: string | null = await page.$eval(
  //     "div.css-j7qwjs",
  //     (element) => {
  //       const offerEndDate: HTMLSpanElement | null = element.querySelector(
  //         "div.css-15fg505 span.css-iqno47",
  //       );
  //       return offerEndDate ? offerEndDate.innerText : null;
  //     },
  //   );

  //   return { ...currPrice, offerEndDate: this.offerDateFormat(offerEndDate!) };
  // }

  // private offerDateFormat = (offer: string) => {
  //   if (!offer) {
  //     return;
  //   }
  //   const regex =
  //     /Sale ends (\d{1,2})\/(\d{1,2})\/(\d{4}) at (\d{1,2}):(\d{2}) (AM|PM)/;
  //   const match = offer.match(regex);

  //   if (match) {
  //     const month = parseInt(match[1]);
  //     const day = parseInt(match[2]);
  //     const year = parseInt(match[3]);
  //     let hour = parseInt(match[4]);
  //     const minute = parseInt(match[5]);
  //     const period = match[6];

  //     if (period === "PM" && hour < 12) {
  //       hour += 12;
  //     }
  //     if (period === "AM" && hour === 12) {
  //       hour = 0;
  //     }

  //     const endDate = new Date(year, month - 1, day, hour, minute);

  //     return endDate.toISOString();
  //   }
  //   return;
  // };
}
