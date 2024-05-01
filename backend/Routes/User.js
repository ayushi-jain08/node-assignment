import express from "express";
import {
  ForgetPass,
  OtpVerify,
  RegisterUser,
  loginUser,
} from "../Controller/User.js";
import { loginvalidator, registervalidator } from "../Utils/Validator.js";
const router = express.Router();

router.post("/register", registervalidator, RegisterUser);
router.post("/login", loginvalidator, loginUser);
router.post("/forgot-password", ForgetPass)
router.post("/verify-otp", OtpVerify)

export default router;
