import { Router } from "express";
import { getGameInfo, getGamesPrices } from "../controllers/game.controller";

const router = Router();
router.get("/game", getGamesPrices);
router.get("/test", getGameInfo);

export default router;
