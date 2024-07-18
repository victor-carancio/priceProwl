import { Router } from "express";
import {
  disableAccount,
  login,
  signup,
  updateInfoProfile,
} from "../controllers/auth.controller";
import {
  userLoginSchema,
  userSignUpSchema,
  userUpdateSchema,
} from "../schemas/auth.schema";
import { validateData } from "../middlewares/validation";
import { authValidation } from "../middlewares/authHandler";

const router = Router();

/**
 * Post track
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *      - auth
 *     summary: "Login user"
 *     description: "Allows the user to log in with their email or user name."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/login"
 *     responses:
 *       '200':
 *          description: >
 *              Successfully authenticated. Session id returned in a cookie named `authCookie`.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/authResponse"
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: authCookie=qwerty12345; path=/; HttpOnly
 *       '403':
 *          description: User account was delete, to reactive, contact support team.
 * */

router.post("/login", validateData(userLoginSchema), login);

/**
 * Post track
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *      - auth
 *     summary: "Register user"
 *     description: "Allows the user to register with their email or user name."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/signUp"
 *     responses:
 *       '201':
 *          description: Account was successfully created. Session id returned in a cookie named `authCookie`.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/authResponse"
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: authCookie=qwerty12345; path=/; HttpOnly
 *       '400':
 *           description: "User already exist"
 *       '403':
 *           description: User account was delete, to reactive, contact support team.
 *  */

router.post("/signup", validateData(userSignUpSchema), signup);

/**
 * Patch track
 * @openapi
 * /auth/update:
 *   patch:
 *     tags:
 *      - auth
 *     summary: "Update user info"
 *     description: "Allows the user to update  their email, password or username."
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/updateUserInfo"
 *     responses:
 *       '200':
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/updateUserResponse"
 *       '400':
 *          description: Invalid data.
 *       '401':
 *          description: Authentication invalid, log in or sign up.
 *     security:
 *        - cookieAuth: []
 *  */
router.patch(
  "/update",
  authValidation,
  validateData(userUpdateSchema),
  updateInfoProfile,
);
/**
 * Delete track
 * @openapi
 * /auth/delete:
 *   delete:
 *     tags:
 *      - auth
 *     summary: "Delete user from app."
 *     description: "Allows the user to delete their account."
 *     responses:
 *       '200':
 *          description: Ok
 *       '401':
 *          description: Authentication invalid, log in or sign up.
 *     security:
 *        - cookieAuth: []
 *  */
router.delete("/delete", authValidation, disableAccount);

export default router;
