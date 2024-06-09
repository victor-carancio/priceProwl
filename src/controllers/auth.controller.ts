import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createUser,
  deleteUser,
  loginUser,
  updateUser,
} from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  return res.status(StatusCodes.CREATED).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const user = await loginUser(req.body);
  return res.status(StatusCodes.OK).json({ user });
};

export const updateInfoProfile = async (req: Request, res: Response) => {
  const user = await updateUser(req.user!, req.body);
  return res.status(StatusCodes.OK).json({ msg: "Profile info updated", user });
};

//To do: password recovery

export const disableAccount = async (req: Request, res: Response) => {
  await deleteUser(req.user!);
  return res.status(StatusCodes.OK).json({ msg: "account deleted" });
};
