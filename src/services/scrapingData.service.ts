import playwright from "playwright";
import random_useragent from "random-useragent";
import { SteamStore } from "../models/oficial-stores/steam.class";
import { XboxStore } from "../models/oficial-stores/xbox.class";
import { EpicStore } from "../models/oficial-stores/epic.class";
// import { epicGames } from "../types";

// const officialStores = [
//   {
//       storeName:"epic",
//       url:"https://store.epicgames.com/es-ES/browse?q=god%20of%20war&sortBy=relevancy&sortDir=DESC&category=Game&count=40&start=0",
//       games: async (context:BrowserContext, url:string) => {
//           const page = await context.newPage()
//           await page.goto(url)
//           // await page.waitForSelector("div.css-uwwqev") imagen
//           await page.waitForSelector("section.css-1ufzxyu")

//           const content = await page.evaluate(()=>{

//               let results:any = [];
//               const notFound = document.querySelector("div.css-17qmv99 div.css-1dbkmxi")
//               if(notFound){
//                   return "Not found in store"
//               }
//               const urls:NodeListOf<HTMLAnchorElement> = document.querySelectorAll("div.css-2mlzob a")
//               for(let item of urls){

//                   const gameName:HTMLDivElement| null = item.querySelector("div.css-lgj0h8 div")
//                   const gameType:HTMLSpanElement| null = item.querySelector("span.css-1825rs2 span")
//                   const gameDiscount:HTMLDivElement | null = item.querySelector("div.css-1q7f74q");
//                   const gameFinalPrice:HTMLSpanElement| null = item.querySelector("div.css-l24hbj span.css-119zqif")
//                   const gameOriginalPrice:HTMLDivElement | null= item.querySelector("span.css-d3i3lr div.css-4jky3p")

//                   const game : any={
//                       gameName : gameName?.innerText,
//                       typeS : gameType?.innerText,
//                       url : item.href,
//                       discount_percent: gameDiscount ? gameDiscount.innerText : "-",
//                       inital_price: gameDiscount ? gameOriginalPrice?.innerText : gameFinalPrice?.innerText,
//                       final_price:gameFinalPrice?.innerText,
//                   }

//                   results.push(game)
//               }
//               console.log(results)
//               return results
//           })

//           return content

//       }
//   },
//   {
//       storeName:"microsoft",
//       url:"https://www.xbox.com/es-CL/search/results/games?q=resident+evil&PlayWith=PC",
//       games: async (context : BrowserContext, url:string  ) => {
//           const page = await context.newPage()
//           await page.goto(url)

//           await page.waitForSelector("div.SearchTabs-module__tabContainer___MR492")
//           // await page.waitForTimeout(3000)
//           // await page.screenshot({path:"jio.png"})

//           const content = await page.evaluate(()=>{

//               let results:any = [];
//               const  urls:NodeListOf<HTMLAnchorElement> = document.querySelectorAll("div.ProductCard-module__cardWrapper___6Ls86 a")

//               for (let item of urls){
//                   const gameName:HTMLDivElement| null = item.querySelector("div.ProductCard-module__infoBox___M5x18 span")
//                   const gameDiscount:HTMLDivElement | null = item.querySelector("div.ProductCard-module__discountTag___OjGFy");
//                   const gameFinalPrice:HTMLSpanElement| null = item.querySelector("span.Price-module__listedDiscountPrice___67yG1")
//                   const originalPriceSelector = gameDiscount ? "": ".Price-module__moreText___q5KoT"
//                   const gameOriginalPrice:HTMLSpanElement | null= item.querySelector(`div.typography-module__xdsBody2___RNdGY span${originalPriceSelector}`)
//                   const gamePass : HTMLTitleElement | null= item.querySelector("svg.SubscriptionBadge-module__gamePassBadge___ukbVg title")

//                   const game : any={
//                       gameName : gameName?.innerText,
//                       url : item.href,
//                       discount_percent: gameDiscount ? gameDiscount.innerText : "-",
//                       inital_price: gameOriginalPrice?.innerText,
//                       final_price: gameFinalPrice ? gameFinalPrice?.innerText : gameOriginalPrice?.innerText,
//                       gamepass: gamePass ? true:false,
//                   }

//                   results.push(game)
//               }

//               return results
//           })

//           return content

//       }
//   },
//   {
//     storeName: "steam",
//     url: "https://store.steampowered.com/search/?term=god+of+war&category1=998&ndl=1",
//     games: async (context: BrowserContext, url: string) => {
//       const page = await context.newPage();
//       await page.goto(url);
//       await page.waitForSelector("div.search_results");

//       const content = await page.evaluate(() => {
//         let results: any = [];
//         const notFound = document.querySelector("div#search_resultsRows");
//         if (!notFound) {
//           return "Not found in store";
//         }
//         const urls: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("div#search_resultsRows a.search_result_row")

//         for (let item of urls) {
//           const gameName: HTMLSpanElement | null = item.querySelector(
//             "div.search_name span.title"
//           );
//           const gameDiscount: HTMLDivElement | null = item.querySelector(
//             "div.discount_pct"
//           );
//           const gameFinalPrice: HTMLDivElement | null = item.querySelector(
//             "div.discount_final_price"
//           );
//           const originalPriceSelector = gameDiscount
//             ? "discount_original_price"
//             : "discount_final_price";
//           const gameOriginalPrice: HTMLDivElement | null = item.querySelector(
//             `div.${originalPriceSelector}`
//           );

//           const game: any = {
//             gameName: gameName?.innerText,
//             url: item.href,
//             discount_percent: gameDiscount ? gameDiscount.innerText : "-",
//             inital_price: gameOriginalPrice?.innerText,
//             final_price: gameFinalPrice?.innerText
//         }

//           results.push(game);
//         }

//         return results;
//       });

//       return content;
//     },
//   },
// ];

export const scraper = async () => {
  const agent = random_useragent.getRandom();
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: agent });

  const stores = [new SteamStore(), new XboxStore(), new EpicStore()];

  const gamesForStore: any = [];
  for (const store of stores) {
    const games = await store.scrapeGames(context, "resident evil");
    gamesForStore.push(games);
  }
  console.log(gamesForStore);

  await browser.close();
};
