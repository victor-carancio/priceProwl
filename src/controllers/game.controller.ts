import { Request, Response } from "express";
import { findGamesByName } from "../services/game.service";

export const getGamesPrices = async (req: Request, res: Response) => {
  const { title } = req.body;
  const data = await findGamesByName(title);
  return res.status(200).json({ data });
};
