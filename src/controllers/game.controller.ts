import { Request, Response } from "express";
import { findGamesPricesByName } from "../services/game.service";
import {
  findAllGames,
  findCurrOfferGames,
  // findAllGames,
  findGameById,
  // findCurrOfferGames,
  findGameByName,
} from "../services/gameServices/manageGameData.service";
import { parseInteger, parseString } from "../utils/validation";
import { BadRequestError } from "../responses/customApiError";
import { newScrape } from "../services/gameServices/scrapeGameData.service";
// import { scrapeAllGamesFromUrl } from "../services/gameServices/scrapeGameData.service";

export const getGamesPrices = async (req: Request, res: Response) => {
  const title = parseString(req.query.title, "Game title");
  console.log(title);
  const data = await findGamesPricesByName(title);
  return res.status(200).json({ nbHts: data.length, data });
};

export const getGamesByNameFromDB = async (req: Request, res: Response) => {
  const title = parseString(req.query.title, "Game title");
  const data = await findGameByName(title);
  return res.status(200).json({ nbHts: data.length, data });
};

export const getCurrentOffers = async (_req: Request, res: Response) => {
  const data = await findCurrOfferGames();
  return res.status(200).json({ nbHts: data.length, data });
};

export const getAllGames = async (_req: Request, res: Response) => {
  const data = await findAllGames();
  return res.status(200).json({ nbHts: data.length, data });
};

export const getGameById = async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestError("Id must be provided");
  }
  const id = parseInteger(req.params.id, "Game ID");

  const data = await findGameById(id);
  return res.status(200).json(data);
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
  const title = parseString(_req.query.title, "Game title");

  const data = await newScrape(title);
  return res.status(200).json({ data });
};
