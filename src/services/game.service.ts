import { BadRequestError } from "../responses/customApiError";
import { isString } from "../utils/validation";
import { scraper } from "./scrapingData.service";

export const findGamesByName = async (title: string): Promise<any> => {
  if (!isString(title)) {
    throw new BadRequestError("invalid field");
  }
  const games = await scraper(title);
  return games;
};

// export const findOneGameByName = async (title: string): Promise<steamPrice> => {
//   if (!isString(title)) {
//     throw new BadRequestError("invalid field");
//   }

//   const gameData = await getDataFromUrl(title);
//   const { name, steam_appid, header_image, price_overview } = gameData[0].data;

//   return { name, steam_appid, header_image, price_overview };
// };
