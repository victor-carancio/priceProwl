import { Router } from "express";
import { disableAccount, login, signup } from "../controllers/auth.controller";
import { userLoginSchema, userSignUpSchema } from "../schemas/auth.schema";
import { validateData } from "../middlewares/validation";
import { authValidation } from "../middlewares/authHandler";

const router = Router();

router.post("/login", validateData(userLoginSchema), login);
router.post("/signup", validateData(userSignUpSchema), signup);
router.delete("/delete", authValidation, disableAccount);

export default router;
