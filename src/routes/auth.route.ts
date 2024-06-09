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

router.post("/login", validateData(userLoginSchema), login);
router.post("/signup", validateData(userSignUpSchema), signup);
router.patch(
  "/update",
  authValidation,
  validateData(userUpdateSchema),
  updateInfoProfile,
);
router.delete("/delete", authValidation, disableAccount);

export default router;
