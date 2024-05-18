import { Request, Response } from "express";
import {
  findGameInfoByName,
  findGamesPricesByName,
} from "../services/game.service";

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
