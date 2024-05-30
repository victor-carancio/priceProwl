// import { Page } from "playwright";
// import { parseUrl } from "../../utils/game.utils";
// import { Store } from "../store.class";
// import { GamePriceInfo, StoreInfo } from "../../types";

// export class EnebaStore extends Store {
//   constructor() {
//     super(
//       "Eneba",
//       "https://www.eneba.com/latam/store/all?drms[]=steam&page=1&regions[]=global&regions[]=latam&text="
//     );
//   }

//   modifyUrl(query: string): string {
//     const queryUrl = parseUrl(query, "%20");
//     this.setUrl(this.getUrl() + queryUrl + "&types[]=game"); // pc game
//     return this.getUrl();
//   }

//   async scrapeGames(page: Page, query: string): Promise<StoreInfo> {
//     await page.goto(this.modifyUrl(query));
//     // await page.waitForLoadState("networkidle");

//     await page.waitForSelector("div.Gn2rwQ section");

//     const notFound = await page.evaluate(() =>
//       document.querySelector("div.ZM481c")
//     );

//     if (notFound) {
//       return { [this.name]: [] };
//     }

//     // await page.locator("li.rc-pagination-item.rc-pagination-item-3").click();
//     // await page.waitForLoadState("networkidle");
//     // page.keyboard.press("End");
//     // await page.waitForTimeout(2000);
//     // const paginationCount = await page
//     //   .locator("li[aria-disabled=true].rc-pagination-next")
//     //   .count();
//     // console.log(paginationCount);

//     // if (paginationCount <= 0) {
//     //   console.log("avanza a la siguiente");
//     // } else {
//     //   console.log("se detiene");
//     // }

//     const newGameList = [];

//     for (let i = 0; i < 5; i++) {
//       console.log("numero de loop: " + i);
//       page.keyboard.press("End");
//       await page.waitForTimeout(2500);
//       await page.waitForLoadState("networkidle");

//       const content: GamePriceInfo[] = await page.$$eval(
//         "div.pFaGHa",
//         (elements) => {
//           return elements.map((el) => {
//             const gameName: HTMLSpanElement = el.querySelector(
//               "div.tUUnLz span.YLosEL"
//             )!;

//             const url: HTMLAnchorElement = el.querySelector(
//               "div.b3POZC a.oSVLlh"
//             )!;

//             const gameFinalPrice: HTMLDivElement | null = el.querySelector(
//               "div.b3POZC span.L5ErLT"
//             );
//             return {
//               gameName: gameName?.innerText,
//               url: url?.href,
//               final_price: gameFinalPrice?.innerText,
//             };
//           });
//         }
//       );

//       for (const game of content) {
//         newGameList.push(game);
//       }

//       const nextPageCount = await page.locator("li.rc-pagination-next").count();
//       if (nextPageCount <= 0) {
//         break;
//       }

//       const paginationCount = await page
//         .locator("li[aria-disabled=true].rc-pagination-next")
//         .count();

//       if (paginationCount > 0) {
//         console.log("se scrapeo toda la informacion");
//         break;
//       }
//       await page.locator("li.rc-pagination-next").click();
//       await page.waitForSelector("div.pFaGHa");
//       await page.waitForTimeout(1000);
//     }
//     console.log("numero de juegos encontrados: " + newGameList.length);
//     return { [this.name]: newGameList };

//     // const element = page.locator("ul.rc-pagination");
//     // await element.scrollIntoViewIfNeeded();
//     // await page.waitForTimeout(2000);
//     // await page.screenshot({ path: "jio.png" });

//     // const games = content.filter((game: any) =>
//     //   game.gameName.toLowerCase().includes(query.trim().toLowerCase())
//     // );
//     // return { [this.name]: games };
//   }
// }
