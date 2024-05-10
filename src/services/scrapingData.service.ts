// import playwright from "playwright";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import random_useragent from "random-useragent";
import { SteamStore } from "../models/official-stores/steam.class";
import { XboxStore } from "../models/official-stores/xbox.class";
import { EpicStore } from "../models/official-stores/epic.class";
import { GameStoresPrices, StoreInfo } from "../types";
import { getGameByStorePrices } from "../utils/game.utils";

chromium.use(StealthPlugin());

export const scraper = async (title: string): Promise<GameStoresPrices[]> => {
  const agent = random_useragent.getRandom();
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: agent,
  });
  const page = await context.newPage();

  const stores = [new SteamStore(), new XboxStore(), new EpicStore()];
  const gamesForStore: StoreInfo[] = [];
  for (const store of stores) {
    const games = await store.scrapeGames(page, title);

    gamesForStore.push(games);
  }

  await browser.close();

  const gameByStorePrices: GameStoresPrices[] =
    getGameByStorePrices(gamesForStore);

  return gameByStorePrices;
};
