// import { Router } from "express";
// import {
//   addGame,
//   deleteGame,
//   getUserWishList,
// } from "../controllers/wishList.controller";
// import { authValidation } from "../middlewares/authHandler";
// import { containsGameIdSchema } from "../schemas/wishList.schema";
// import { validateData } from "../middlewares/validation";

// const router = Router();

// /*
//  * Get track
//  * @openapi
//  * /wishlist:
//  *   get:
//  *     tags:
//  *      - wishlist
//  *     summary: "Obtain user wishlist"
//  *     description: "Allows the user to obtain all the wishlist."
//  *     responses:
//  *       '200':
//  *          description: >
//  *              Ok.
//  *       '401':
//  *          description: Authentication invalid, log in or sign up.
//  *     security:
//  *        - cookieAuth: []
//  * */
// router.get("/", authValidation, getUserWishList);

// /*
//  * Post track
//  * @openapi
//  * /wishlist:
//  *   post:
//  *     tags:
//  *      - wishlist
//  *     summary: "Add game to wishlist"
//  *     description: "Allows the user to add game to wishList."
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: "#/components/schemas/addToWishlist"
//  *     responses:
//  *       '200':
//  *          description: >
//  *              Ok.
//  *       '401':
//  *          description: Authentication invalid, log in or sign up.
//  *     security:
//  *        - cookieAuth: []
//  * */
// router.post("/", validateData(containsGameIdSchema), authValidation, addGame);

// /*
//  * Delete track
//  * @openapi
//  * /wishlist:
//  *   delete:
//  *     tags:
//  *      - wishlist
//  *     summary: "Delete game from wishlist"
//  *     description: "Allows the user to delete game from wishList."
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: "#/components/schemas/addToWishlist"
//  *     responses:
//  *       '200':
//  *          description: >
//  *              Ok.
//  *       '401':
//  *          description: Authentication invalid, log in or sign up.
//  *     security:
//  *        - cookieAuth: []
//  * */
// router.delete(
//   "/",
//   validateData(containsGameIdSchema),
//   authValidation,
//   deleteGame,
// );

// export default router;
