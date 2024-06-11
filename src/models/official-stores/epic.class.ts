import { Page } from "playwright";
import { parseUrl, replaceSteam } from "../../utils/game.utils";
import { Store } from "../store.class";
import { GamePriceInfo, StoreInfo } from "../../types";

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
    return currPrice;
  }
}
