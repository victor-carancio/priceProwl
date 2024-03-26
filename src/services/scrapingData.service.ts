import playwright from "playwright";
import random_useragent from "random-useragent";
// import { SteamStore } from "../models/official-stores/steam.class";
// import { XboxStore } from "../models/official-stores/xbox.class";
// import { EpicStore } from "../models/official-stores/epic.class";
// import { GreenManGaming } from "../models/non-official-stores/greenManGaming.class";
import { EnebaStore } from "../models/non-official-stores/eneba.class";

export const scraper = async () => {
  const agent = random_useragent.getRandom();
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: agent });

  // const stores = [
  //   new SteamStore(),
  //   new XboxStore(),
  //   new EpicStore(),
  //   new GreenManGaming(),
  // ];
  const stores = [new EnebaStore()];
  const gamesForStore: any = [];
  for (const store of stores) {
    const games = await store.scrapeGames(context, "resident evil");
    gamesForStore.push(games);
    console.log({ [store.name]: games });
  }
  console.log(gamesForStore);

  await browser.close();
};
