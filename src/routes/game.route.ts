import { Router } from "express";
import {
  testUpdateGamePrice,
  getGamesPrices,
  getGamesByNameFromDB,
  getGamesByNameFromDBAndUpdatePrice,
} from "../controllers/game.controller";

const router = Router();
router.get("/game", getGamesPrices);
router.get("/search", getGamesByNameFromDB);
router.get("/update/search", getGamesByNameFromDBAndUpdatePrice);
router.get("/test", testUpdateGamePrice);

export default router;
