import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createUser, loginUser } from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  return res.status(StatusCodes.CREATED).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const user = await loginUser(req.body);
  return res.status(StatusCodes.OK).json({ user });
};

export const disableAccount = async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({ msg: "account deleted" });
};
