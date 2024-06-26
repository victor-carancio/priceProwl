import { Request, Response } from "express";
import {
  findGameInfoByName,
  findGamesPricesByName,
} from "../services/game.service";
import {
  scrapeAllGamesFromUrl,
  scrapeSearchedGamesFromUrl,
} from "../services/gameServices/scrapeGameData.service";
import { findGameByName } from "../services/gameServices/manageGameData.service";
import { parseString } from "../utils/validation";

export const getGamesPrices = async (req: Request, res: Response) => {
  const { title } = req.body;
  const data = await findGamesPricesByName(title);
  return res.status(200).json({ nbHts: data.length, data });
};

export const getGameInfo = async (req: Request, res: Response) => {
  const { title } = req.body;
  const data = await findGameInfoByName(title);

  return res.status(200).json({ nbHts: data.length, data });
};

export const testUpdateGamePrice = async (_req: Request, res: Response) => {
  await scrapeAllGamesFromUrl();
  return res.status(200).json({ jio: "test update game" });
};

export const getGamesByNameFromDBAndUpdatePrice = async (
  req: Request,
  res: Response,
) => {
  const title = parseString(req.query.title, "game");
  const data = await findGameByName(title);
  res.status(200).json({ nbHts: data.length, data });
  await scrapeSearchedGamesFromUrl(data);
};

export const getGamesByNameFromDB = async (req: Request, res: Response) => {
  const title = parseString(req.query.title, "game");
  const data = await findGameByName(title);
  return res.status(200).json({ nbHts: data.length, data });
};
