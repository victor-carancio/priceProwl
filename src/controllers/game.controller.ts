import { Request, Response } from "express";
import {
  findAllGamesAndFilters,
  findGamesByNameFromDb,
  findGamesPricesByName,
} from "../services/game.service";

import { parseInteger, parseString } from "../utils/validation";
import { BadRequestError } from "../responses/customApiError";
import {
  findGameById,
  getCurrentGenres,
} from "../services/gameServices/index.service";
import {
  getCurrentCategories,
  getFeaturedGamesByStore,
} from "../services/gameServices/gameData/findDataGame.service";

export const getGamesPrices = async (req: Request, res: Response) => {
  const title = parseString(req.query.title, "Game title");

  await findGamesPricesByName(title);
  const data = await findGamesByNameFromDb(title, req.query);
  return res.status(200).json({ nbHts: data.length, data });
};

export const getGamesByNameFromDB = async (req: Request, res: Response) => {
  const title = parseString(req.query.title, "Game title");
  const data = await findGamesByNameFromDb(title, req.query);
  return res.status(200).json({ nbHts: data.length, data });
};

export const getGamesByFilters = async (req: Request, res: Response) => {
  const { currentPage, games, totalGames, totalPages } =
    await findAllGamesAndFilters(req.query);

  return res
    .status(200)
    .json({ nbHts: games.length, currentPage, totalGames, totalPages, games });
};

export const getGameById = async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestError("Id must be provided");
  }
  const id = parseInteger(req.params.id, "Game ID");

  const data = await findGameById(id);
  return res.status(200).json(data);
};

export const getGamesGenresInDatabase = async (
  _req: Request,
  res: Response,
) => {
  const genres = await getCurrentGenres();
  return res.status(200).json({ nbHts: genres.length, genres });
};
export const getGamesCategoriesInDatabase = async (
  _req: Request,
  res: Response,
) => {
  const categories = await getCurrentCategories();
  return res.status(200).json({ nbHts: categories.length, categories });
};

export const getCurrentFeaturedGames = async (_req: Request, res: Response) => {
  const featuredGames = await getFeaturedGamesByStore();
  return res.status(200).json(featuredGames);
};

// export const getCurrentOffers = async (_req: Request, res: Response) => {
//   const data = await findCurrOfferGames();
//   return res.status(200).json({ nbHts: data.length, data });
// };

/* ------------------------------ Web sockets --------------------------*/

// export const getGamesByNameFromDBAndUpdatePrice = async (
//   req: Request,
//   res: Response,
// ) => {
//   const title = parseString(req.query.title, "Game title");

//   const data = await findGameByName(title);

//   res.status(200).json({ nbHts: data.length, data });
//   scrapeSearchedGamesFromUrl(data)
//     .then((updateData) => {
//       io.emit("priceUpdate", updateData);
//     })
//     .catch((error) => {
//       console.log("Error scraping game prices: ", error);
//     });
//   await scrapeSearchedGamesFromUrl(data);
// };

/* ------------------------------ test de funciones --------------------------*/

// export const testUpdateGamePrice = async (_req: Request, res: Response) => {
//   // await featuredGamesCheck();
//   await EpicFreeGamesCheck();
//   const jio = await getFeaturedGamesByStore();

//   console.log("finish");
//   return res.status(200).json({
//     jio,
//   });
// };
