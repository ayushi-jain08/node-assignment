import express from "express";
import {
  RegisterUser,
  ResetPassword,
  SendResetPasswordLink,
  VerifyUser,
  loginUser,
} from "../Controller/User.js";
import { loginvalidator, registervalidator } from "../Utils/Validator.js";
const router = express.Router();

router.post("/register", registervalidator, RegisterUser);
router.post("/login", loginvalidator, loginUser);
router.post("/sendpasswordlink", SendResetPasswordLink);
router.get("/forgotpassword/:id/:token", VerifyUser);
router.post("/resetpassword/:id/:token", ResetPassword);
export default router;
