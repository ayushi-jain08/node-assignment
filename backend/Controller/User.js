import User from "../Model/User.js";
import Jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../Utils/ErrorrValidator.js";
import { validationResult } from "express-validator";
import logger from "../Utils/pino.js";
import Otp from "../Model/Otp.js";
import sendEmail from "../Utils/email.utils.js";
import generateOTP from "../Utils/generateOtp.utils.js";

//=============REGISTER USER===================//
export const RegisterUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(errorHandler(200, errors.array()));
    }
    let user;
    const hashPassword = bcryptjs.hashSync(password, 10);
    const userExist = await User.findOne({ username });
    if (userExist) {
      logger.error("This email already exist")
      next(errorHandler(400, "This email already exist"));
    }
    
      user = new User({
        username,
        email,
        password: hashPassword,
      });
    await user.save();
    res.status(200).json({
      msg: "User successfully register",
    });
  } catch (error) {
    logger.error('Error at User.controller while registering user', error)
    next(error);
  }
};

//======================LOGIN USER======================//
export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(errorHandler(200, errors.array()));
    }
    const validUser = await User.findOne({ username });
    if (!validUser) {
      logger.error("User not found")
      next(errorHandler(404, "User not found"));
    }
    const ComparePass = bcryptjs.compareSync(password, validUser.password);
    if (!ComparePass) {
      logger.error("Invalid Credentials")
      return next(errorHandler(401, "Invalid Credentials"));
    } else {
      const token = Jwt.sign({ id: validUser._id }, process.env.SECRET_KEY);
      const { password: pass, ...otherDeatils } = validUser._doc;

      return res.status(200).json({
        users: { otherDeatils, token },
      });
    }
  } catch (error) {
    logger.error('Error at User.controller while login user', error)
    next(error);
  }
};

// ---------------- forget password controller  ------------------------
export const ForgetPass = async (req, res,next) => {
  const email = req.body.email;
  try {
    if (!email) {
      logger.error('email is required');
     next(errorHandler(400,"Email is required"))
    }

    // Check if the email exists in the User collection
    const user = await User.findOne({ email });
    if (!user) {
      logger.error('User with this email does not exist');
      return next(errorHandler(404, "User with this email does not exist"));
    }
    const otp = generateOTP();
    const options = { email, otp };
    const emailResponse = await sendEmail(options);

    if (emailResponse.success) {
      await Otp.create({ email, otp, createdAt: new Date() });
      logger.info(emailResponse.message);
      return res.json({ message: emailResponse.message });
    } else {
      next(errorHandler(400,emailResponse.error))
    }
  } catch (error) {
    logger.error(error);
    next(error)
  }
}

// ---------------- otp-verify & password-change controller  ------------------------
export const OtpVerify = async (req, res,next) => {
  const { email, otp, password } = req.body;
  try {
    if (!email || !password || !otp) {
      logger.error('email password and otp are required');
      next(errorHandler(400,'email password and otp are required'))
    }

    const storedOtpDoc = await Otp.findOne({ email }).sort({ 'created_at': -1 }).lean();
    if (!storedOtpDoc || storedOtpDoc.otp !== otp.toString()) {
      logger.error("Oops! Verification failed. The OTP entered is incorrect")
      next(errorHandler(403,"Oops! Verification failed. The OTP entered is incorrect"))
    }

    const hashPassword = bcryptjs.hashSync(password, 10);
    await User.findOneAndUpdate({ email }, { $set: { password: hashPassword } }, { returnOriginal: false });
      // Delete the OTP document after successfully changing the password
      await Otp.deleteOne({ email });
     logger.info("otp verified and password changed successfully")
    res.status(201).json({ message: "otp verified and password changed successfully" });
  } catch (error) {
    logger.error(error);
   next(error)
  }
}

