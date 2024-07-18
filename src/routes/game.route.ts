import { Router } from "express";
import {
  getGamesPrices,
  getGamesByNameFromDB,
  testUpdateGamePrice,
} from "../controllers/game.controller";

const router = Router();

/**
 * Get track
 * @openapi
 * /game:
 *   get:
 *     tags:
 *      - game
 *     summary: "Scrape game prices and info from stores pages and store in database."
 *     description: "Obtain information on games and prices by stores directly from the stores' pages (scraping the information takes more time). "
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         description: Name of game to search in database.
 *         schema:
 *            type: string
 *     responses:
 *       '200':
 *          description: Scraper worked fine, return info succesfully. Save in database.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/gamesFromScraper"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */
router.get("/", getGamesPrices);

/**
 * Get track
 * @openapi
 * /game/search:
 *   get:
 *     tags:
 *      - game
 *     summary: Get game prices and info from database.
 *     description: >
 *        Obtain game info and prices directly from database.
 *          if the game wasn't store or search by scraper previusly, it will return empty array.
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         description: Name of game to search in database.
 *         schema:
 *            type: string
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/gamesFromDB"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */
router.get("/search", getGamesByNameFromDB);

/*
 * Get track
 * @openapi
 * /game/update/search:
 *   get:
 *     tags:
 *      - game
 *     summary: Get game prices and info from database.
 *     description: >
 *        Obtain game info and prices directly from database.
 *          if the game wasn't store or search by scraper previusly, it will return empty array.
 *            After return info, WebSockets are used to notify customers about any price updates.
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         description: Name of game to search in database.
 *         schema:
 *            type: string
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/authResponse"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */

// router.get("/update/search", getGamesByNameFromDBAndUpdatePrice);
router.get("/test", testUpdateGamePrice);

export default router;
