import { Router } from "express";
import {
  testUpdateGamePrice,
  getGamesPrices,
} from "../controllers/game.controller";

const router = Router();
router.get("/game", getGamesPrices);
router.get("/test", testUpdateGamePrice);

export default router;
