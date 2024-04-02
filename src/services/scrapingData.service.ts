import playwright from "playwright";
import random_useragent from "random-useragent";
import { SteamStore } from "../models/official-stores/steam.class";
import { XboxStore } from "../models/official-stores/xbox.class";
import { EpicStore } from "../models/official-stores/epic.class";
import { GreenManGaming } from "../models/non-official-stores/greenManGaming.class";
import { Store } from "../models/store.class";
import { Game, GamePriceInfo } from "../types";

// const usersaAgents = [
//   "Mozilla/5.0 (X11; Linux i686; rv:2.0b6pre) Gecko/20100907 Firefox/4.0b6pre",
//   "Mozilla/5.0 (MSIE 9.0; Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14931",
// ];
export const scraper = async (title: string): Promise<Game[]> => {
  const agent = random_useragent.getRandom();
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: agent,
  });
  const page = await context.newPage();

  const stores = [
    new SteamStore(),
    new XboxStore(),
    new EpicStore(),
    new GreenManGaming(),
  ];
  const gamesForStore: any = [];
  for (const store of stores) {
    const games = await store.scrapeGames(page, title);
    gamesForStore.push(games);
  }

  await browser.close();

  let gameByStorePrices: Game[] = [];

  gamesForStore.forEach((el: Store) => {
    for (const [store, games] of Object.entries(el)) {
      games.forEach((currGame: GamePriceInfo) => {
        const {
          gameName,
          url,
          discount_percent,
          initial_price,
          final_price,
          gamepass,
        } = currGame;
        const position = gameByStorePrices.findIndex(
          (element: Game) =>
            element.gameName?.toLowerCase() === gameName?.toLowerCase()
        );
        if (position === -1) {
          gameByStorePrices.push({
            gameName,
            stores: [
              {
                store,
                info: {
                  url,
                  discount_percent,
                  initial_price,
                  final_price,
                  gamepass,
                },
              },
            ],
          });
        } else {
          gameByStorePrices[position].stores.push({
            store,
            info: {
              url,
              discount_percent,
              initial_price,
              final_price,
              gamepass,
            },
          });
        }
      });
    }
  });
  return gameByStorePrices;
};
