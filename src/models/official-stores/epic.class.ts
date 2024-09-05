import { formatToDecimals } from "./../utils.model";
import { Page } from "playwright";
import { parseUrl, replaceSteam } from "../../utils/game.utils";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";
import { CustomApiError } from "../../responses/customApiError";
import { EpicSearch } from "../types";

export class EpicStore extends Store {
  constructor() {
    super("Epic", "https://store.epicgames.com/en-US/browse?q=");
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "%20");
    this.setUrl(
      this.getUrl() +
        queryUrl +
        "&sortBy=relevancy&sortDir=DESC&category=Game&count=40&start=0",
    ); // pc game
    return this.getUrl();
  }

  private searchUrl = (term: string, currency: string) => {
    const queryTerm = parseUrl(term, "+");

    return `https://store.epicgames.com/graphql?operationName=searchStoreQuery&variables=%7B%22allowCountries%22:%22CL%22,%22category%22:%22games%2Fedition%2Fbase%22,%22count%22:40,%22country%22:%22${currency}%22,%22keywords%22:%22${queryTerm}%22,%22locale%22:%22en-EN%22,%22sortBy%22:%22relevancy,viewableDate%22,%22sortDir%22:%22DESC,DESC%22,%22start%22:0,%22tag%22:%22%22,%22withPrice%22:true%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%227d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437%22%7D%7D`;
  };

  async scrapeGamesFromSearch(term: string, currency: string) {
    // const currency = "CL";
    const res = await fetch(this.searchUrl(term, currency));
    if (!res.ok) {
      throw new CustomApiError("Something went wrong.");
    }
    const data = await res.json();

    if (data.data.Catalog.searchStore.elements.length <= 0) {
      return [];
    }
    const currData: EpicSearch[] = [...data.data.Catalog.searchStore.elements];
    // return currData;

    const formatedData = currData.map((element) => {
      const { title, id, price, catalogNs } = element;
      const {
        originalPrice,
        discountPrice,
        currencyInfo,
        discount,
        currencyCode,
      } = price.totalPrice;

      const urlTitle = catalogNs.mappings[0].pageSlug;

      return {
        storeId: id,
        gameName: title,
        url: `https://store.epicgames.com/es-ES/p/${urlTitle}`,
        discount_percent: discount,
        currency: currencyCode,
        initial_price: formatToDecimals(originalPrice, currencyInfo.decimals),
        final_price: formatToDecimals(discountPrice, currencyInfo.decimals),
      };
    });
    // return formatedData;
    const games = formatedData
      .map((el) => {
        return { ...el, gameName: replaceSteam(el.gameName) };
      })

      // .filter((game) =>
      //   game.gameName.toLowerCase().includes(term.trim().toLowerCase()),
      // )
      .filter((game) => game.initial_price && game.final_price);
    return { [this.name]: games };
  }

  async scrapeGames(page: Page, query: string): Promise<StoreInfo> {
    await page.goto(this.modifyUrl(query));

    // await page.waitForTimeout(1000);
    await page.waitForSelector("section.css-1ufzxyu");

    const notFound = await page.evaluate(() =>
      document.querySelector("div.css-17qmv99 div.css-1dbkmxi"),
    );

    if (notFound) {
      return { [this.name]: [] };
    }

    //   async function scrapingConReintento() {
    //     while (intentos > 0) {
    //         try {
    //             // Tu código de scraping con Playwright aquí
    //             intentos = 0; // Termina el bucle si el scraping tiene éxito
    //         } catch (error) {
    //             console.error("Se produjo un error:", error);
    //             intentos--;
    //             console.log(`Reintentando... Intentos restantes: ${intentos}`);
    //             await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos antes de volver a intentar
    //         }
    //     }
    // }

    const content: GamePriceInfo[] = await page.$$eval(
      "div.css-2mlzob",
      (elements) => {
        return elements.map((element) => {
          const gameName: HTMLDivElement | null =
            element.querySelector("div.css-lgj0h8 div");
          const url: HTMLAnchorElement = element.querySelector("a.css-g3jcms")!;
          const gameType: HTMLSpanElement | null = element.querySelector(
            "span.css-1825rs2 span",
          );
          const gameDiscount: HTMLDivElement | null =
            element.querySelector("div.css-1q7f74q");
          const gameFinalPrice: HTMLSpanElement | null = element.querySelector(
            "div.css-l24hbj span.css-119zqif",
          );
          const gameOriginalPrice: HTMLDivElement | null =
            element.querySelector("span.css-d3i3lr div.css-4jky3p");

          return {
            gameName: gameName!.innerText,
            typeS: gameType?.innerText,
            url: url.href,
            discount_percent: gameDiscount ? gameDiscount.innerText : "-",
            initial_price: gameDiscount
              ? gameOriginalPrice?.innerText
              : gameFinalPrice?.innerText,
            final_price: gameFinalPrice?.innerText,
          };
        });
      },
    );

    console.log(content);

    // return content;

    const games: GamePriceInfo[] = content
      .map((el) => {
        return { ...el, gameName: replaceSteam(el.gameName) };
      })

      .filter((game: GamePriceInfo) =>
        game.gameName.toLowerCase().includes(query.trim().toLowerCase()),
      )
      .filter((game) => game.initial_price && game.final_price);
    return { [this.name]: games };
  }

  async scrapePriceGameFromUrl(page: Page, url: string) {
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const birthdaySelector = await page.evaluate(() =>
      document.querySelector("div[data-testid=AgeSelect]"),
    );
    if (birthdaySelector) {
      //day
      await page.locator("button.css-19ah1ww#day_toggle").click();
      await page.waitForSelector("ul#day_menu");
      await page
        .locator("ul#day_menu li.css-1vf7hpq span.css-23anny", {
          hasText: "01",
        })
        .click();
      await page.waitForTimeout(500);
      //month
      await page.locator("button.css-19ah1ww#month_toggle").click();
      await page.waitForSelector("ul#month_menu");
      await page
        .locator("ul#month_menu li.css-1vf7hpq span.css-23anny", {
          hasText: "01",
        })
        .click();
      await page.waitForTimeout(500);
      //year
      await page.locator("button.css-19ah1ww#year_toggle").click();
      await page.waitForSelector("ul#year_menu");
      await page
        .locator("ul#year_menu li.css-1vf7hpq span.css-23anny", {
          hasText: "1994",
        })
        .click();
      await page.waitForTimeout(500);
      await page.locator("button#btn_age_continue").click();

      await page.waitForLoadState("domcontentloaded");
    }

    const currPrice = await page.$eval(
      "div.css-169q7x3",
      (element: HTMLDivElement) => {
        const gameDiscount: HTMLDivElement | null = element.querySelector(
          "div.css-169q7x3 span.css-1kn2h2p div",
        );

        const initialGamePrice: HTMLDivElement = gameDiscount
          ? element.querySelector(
              "div.css-l24hbj span.css-d3i3lr div.css-4jky3p",
            )!
          : element.querySelector("div.css-l24hbj span.css-119zqif")!;

        const finalGamePrice: HTMLDivElement = element.querySelector(
          "div.css-l24hbj span.css-119zqif",
        )!;

        return {
          discount_percent: gameDiscount ? gameDiscount.innerText : "-",
          initial_price: initialGamePrice.innerText,
          final_price: finalGamePrice.innerText,
        };
      },
    );
    //css-j7qwjs
    const offerEndDate: string | null = await page.$eval(
      "div.css-j7qwjs",
      (element) => {
        const offerEndDate: HTMLSpanElement | null = element.querySelector(
          "div.css-15fg505 span.css-iqno47",
        );
        return offerEndDate ? offerEndDate.innerText : null;
      },
    );

    return { ...currPrice, offerEndDate: this.offerDateFormat(offerEndDate!) };
  }

  private offerDateFormat = (offer: string) => {
    if (!offer) {
      return;
    }
    const regex =
      /Sale ends (\d{1,2})\/(\d{1,2})\/(\d{4}) at (\d{1,2}):(\d{2}) (AM|PM)/;
    const match = offer.match(regex);

    if (match) {
      const month = parseInt(match[1]);
      const day = parseInt(match[2]);
      const year = parseInt(match[3]);
      let hour = parseInt(match[4]);
      const minute = parseInt(match[5]);
      const period = match[6];

      if (period === "PM" && hour < 12) {
        hour += 12;
      }
      if (period === "AM" && hour === 12) {
        hour = 0;
      }

      const endDate = new Date(year, month - 1, day, hour, minute);

      return endDate.toISOString();
    }
    return;
  };
}
