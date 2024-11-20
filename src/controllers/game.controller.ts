import { Request, Response } from "express";
import {
  featuredGamesCheck,
  // featuredGamesCheck,
  // featuredGamesCheck,
  // featuredGamesCheck,
  findAllGamesAndFilters,
  findGamesByNameFromDb,
  findGamesPricesByName,
  // offerNotification,
} from "../services/game.service";

import { parseInteger, parseString } from "../utils/validation";
import { BadRequestError } from "../responses/customApiError";
import {
  findCurrOfferGames,
  findGameById,
  getCurrentGenres,
} from "../services/gameServices/index.service";

export const getGamesPrices = async (req: Request, res: Response) => {
  const title = parseString(req.query.title, "Game title");

  const data = await findGamesPricesByName(title);
  return res.status(200).json({ nbHts: data.length, data });
};

export const getGamesByNameFromDB = async (req: Request, res: Response) => {
  const title = parseString(req.query.title, "Game title");
  const data = await findGamesByNameFromDb(title, req.query);
  return res.status(200).json({ nbHts: data.length, data });
};

export const getCurrentOffers = async (_req: Request, res: Response) => {
  const data = await findCurrOfferGames();
  return res.status(200).json({ nbHts: data.length, data });
};

export const getAllGames = async (req: Request, res: Response) => {
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

export const testUpdateGamePrice = async (_req: Request, res: Response) => {
  // const title = parseString(_req.query.title, "Game title");

  // await offerNotification();

  // const steam = new SteamStore();
  // const epic = new EpicStore();
  // const xbox = new XboxStore();
  // const epicData = await xbox.singleNameScrapeFromName(
  //   "Resident Evil 7 Biohazard",
  //   "CL",
  // );
  // const epicData = await epic.scrapeGamesFromSearch("alan wake", "CL");
  // const xboxData = await xbox.scrapeGamesFromSearch("resident evil", "CL");

  // const data = await scrapeAllStores("darkest dungeon");
  // await scrapeAllGamesFromUrl();
  // console.log(steamData);
  const jio = await featuredGamesCheck();
  // const epic = new EpicStore();
  // const jio = await epic.freeEpicGame("CL");
  console.log("finish");
  return res.status(200).json({
    jio,
  });
  // .json({ steam: steamData, epic: epicData, xbox: xboxData });
};
