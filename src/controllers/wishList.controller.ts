// import { Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import {
//   addGameToWishList,
//   findWishListOfUser,
//   removeFromWishList,
// } from "../services/wishList.service";

// export const getUserWishList = async (req: Request, res: Response) => {
//   const data = await findWishListOfUser(req.user!);
//   res.status(StatusCodes.OK).json({ nbHts: data.length, data });
// };

// export const addGame = async (req: Request, res: Response) => {
//   const wishListItem = await addGameToWishList(req.user!, req.body);
//   res
//     .status(StatusCodes.OK)
//     .json({ msg: "Game added to wish list.", data: wishListItem });
// };

// export const deleteGame = async (req: Request, res: Response) => {
//   await removeFromWishList(req.user!, req.body);
//   res
//     .status(StatusCodes.OK)
//     .json({ msg: "The game was remove from wish list." });
// };
