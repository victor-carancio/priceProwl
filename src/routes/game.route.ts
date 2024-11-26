import { Router } from "express";
import {
  getGamesPrices,
  getGamesByNameFromDB,
  // testUpdateGamePrice,
  getGameById,
  // getCurrentOffers,
  getGamesByFilters,
  getGamesGenresInDatabase,
  // testUpdateGamePrice,
  getGamesCategoriesInDatabase,
  getCurrentFeaturedGames,
  // testUpdateGamePrice,
} from "../controllers/game.controller";
import { validateDataQuery } from "../middlewares/validation";
import { filtersSchema } from "../schemas/game.schema";

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
 *                $ref: "#/components/schemas/gameResponse"
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
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Order search by choosen criteria, alphabetical or price.
 *         schema:
 *            type: string
 *       - in: query
 *         name: order
 *         required: false
 *         description: Order of sort, asc or desc.
 *         schema:
 *            type: string
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/gameResponse"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */
router.get("/search", getGamesByNameFromDB);

/**
 * Get track
 * @openapi
 * /game/filters:
 *   get:
 *     tags:
 *      - game
 *     summary: Get all games prices and info from database by filters.
 *     description: >
 *        Obtain games info and prices directly from database by filters.
 *          Either `category` or `genres` must be provided.
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         description: Name of category to filter game in database.
 *         schema:
 *            type: string
 *       - in: query
 *         name: genre
 *         required: false
 *         description: Name of category to filter game in database.
 *         schema:
 *            type: string
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Order search by choosen criteria, alphabetical or price.
 *         schema:
 *            type: string
 *       - in: query
 *         name: order
 *         required: false
 *         description: Order of sort, asc or desc.
 *         schema:
 *            type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Specifies the page number to retrieve in paginated results. Defaults to 1 if not provided.
 *         schema:
 *            type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Specifies the maximum number of items to include in a single page of results. Defaults to 10 if not provided.
 *         schema:
 *            type: string
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/gameSearchFilters"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */

router.get("/filters", validateDataQuery(filtersSchema), getGamesByFilters);

/**
 * Get track
 * @openapi
 * /game/genres:
 *   get:
 *     tags:
 *      - game
 *     summary: Get all genres stores in DB.
 *     description: >
 *        Get all genres stores in DB.
 *          Only return genres of games that been previusly save in DB.
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/genres"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */
router.get("/genres", getGamesGenresInDatabase);
/**
 * Get track
 * @openapi
 * /game/categories:
 *   get:
 *     tags:
 *      - game
 *     summary: Get all categories stores in DB.
 *     description: >
 *        Get all categories stores in DB.
 *          Only return categories of games that been previusly save in DB.
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/categories"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */
router.get("/categories", getGamesCategoriesInDatabase);

/**
 * Get track
 * @openapi
 * /game/feature:
 *   get:
 *     tags:
 *      - game
 *     summary: Get featured games from steam and epic.
 *     description: >
 *        Obtain featured games from steam an epic.
 *          Features are updated one a day.
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/featuredGames"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */
router.get("/feature", getCurrentFeaturedGames);

// router.get("/test", testUpdateGamePrice);
/**
 * Get track
 * @openapi
 * /game/{gameId}:
 *   get:
 *     tags:
 *      - game
 *     summary: Get game prices and all info from  by id.
 *     description: >
 *        Obtain all game info and prices directly from database.
 *          if the game wasn't store or search by scraper previusly, it will return empty array.
 *     parameters:
 *      - in: path
 *        name: gameId
 *        required: true
 *        schema:
 *          type: integer
          
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/gameDetail"
 *       '400':
 *           description: "Invalid data"
 *       '404':
 *           description: "Game not found"
 *       '500':
 *           description: "Internal server error."
 *  */
router.get("/:id", getGameById);

export default router;

/*
 * Get track
 * @openapi
 * /game/offers:
 *   get:
 *     tags:
 *      - game
 *     summary: Get games with offers and info from database.
 *     description: >
 *        Obtain games offers, info and prices directly from database.
 *          if the game wasn't store or search by scraper previusly, it will return empty array.
 *     responses:
 *       '200':
 *          description: Request to database succesfully, return data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/gameResponseDB"
 *       '400':
 *           description: "Invalid data"
 *       '500':
 *           description: "Internal server error."
 *  */
// router.get("/offers", getCurrentOffers);

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
