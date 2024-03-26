import { BrowserContext } from "playwright";
import { parseUrl } from "../../utils/game";
import { Store } from "../store.class";

export class EnebaStore extends Store {
  constructor() {
    super(
      "Eneba",
      "https://www.eneba.com/latam/store/all?os[]=WINDOWS&page=1&regions[]=global&regions[]=latam&text="
    );
  }

  modifyUrl(query: string): string {
    const queryUrl = parseUrl(query, "%20");
    this.setUrl(this.getUrl() + queryUrl + "&types[]=game"); // pc game
    return this.getUrl();
  }

  async scrapeGames(context: BrowserContext, query: string): Promise<any> {
    const page = await context.newPage();
    await page.goto(this.modifyUrl(query));
    // await page.waitForLoadState("networkidle");

    await page.waitForSelector("div.Gn2rwQ section");

    page.keyboard.press("End");
    await page.waitForTimeout(2000);

    // const element = page.locator("ul.rc-pagination");
    // await element.scrollIntoViewIfNeeded();
    // await page.waitForTimeout(2000);
    // await page.screenshot({ path: "jio.png" });
    const notFound = await page.evaluate(() =>
      document.querySelector("div.ZM481c")
    );

    if (notFound) {
      return [];
    }

    const conteent = await page.$$eval("div.pFaGHa", (elements) => {
      return elements.map((el) => {
        const gameName: HTMLSpanElement | null = el.querySelector(
          "div.tUUnLz span.YLosEL"
        );

        const url: HTMLAnchorElement | null = el.querySelector(
          "div.b3POZC a.oSVLlh"
        );

        const gameFinalPrice: HTMLDivElement | null = el.querySelector(
          "div.b3POZC span.L5ErLT"
        );
        return {
          gameName: gameName?.innerText,
          url: url?.href,
          final_price: gameFinalPrice?.innerText,
        };
      });
    });
    console.log("----------------usando $$eval--------------");
    console.log(conteent);

    const content = await page.evaluate(() => {
      let results: any = [];
      // const notFound = document.querySelector("div.ZM481c");
      // if (notFound) {
      //   return "Not found in store";
      // }

      const urls: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll("div.pFaGHa");

      for (let item of urls) {
        const gameName: HTMLSpanElement | null = item.querySelector(
          "div.tUUnLz span.YLosEL"
        );

        const url: HTMLAnchorElement | null = item.querySelector(
          "div.b3POZC a.oSVLlh"
        );

        const gameFinalPrice: HTMLDivElement | null = item.querySelector(
          "div.b3POZC span.L5ErLT"
        );

        const game: any = {
          gameName: gameName?.innerText,
          url: url?.href,
          final_price: gameFinalPrice?.innerText,
        };

        results.push(game);
      }

      return results;
    });

    return content;

    // const games = content.filter((game: any) =>
    //   game.gameName.toLowerCase().includes(query.trim().toLowerCase())
    // );
    // return { [this.name]: games };
  }
}
