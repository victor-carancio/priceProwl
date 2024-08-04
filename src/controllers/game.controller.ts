import { Request, Response } from "express";
import { findGamesPricesByName } from "../services/game.service";
import { findGameByName } from "../services/gameServices/manageGameData.service";
import { parseString } from "../utils/validation";
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
//   // await offerNotification();
//   // await checkOfferEnd();

//   await scrapeAllGamesFromUrl();
//   return res.status(200).json({ msg: "jio" });
// };
