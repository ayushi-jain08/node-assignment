import User from "../Model/User.js";
import Jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { errorHandler } from "../Utils/ErrorrValidator.js";
import { validationResult } from "express-validator";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
//=============REGISTER USER===================//
export const RegisterUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Pass the validation errors to the next middleware
      return next(errorHandler(200, errors.array()));
    }
    let user;
    const hashPassword = bcryptjs.hashSync(password, 10);
    {
      user = new User({
        name,
        email,
        password: hashPassword,
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      next(errorHandler(400, "This email already exist"));
    }
    await user.save();
    res.status(200).json({
      msg: "successfully register",
      user: user._id,
      name,
      email,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
//======================LOGIN USER======================//
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Pass the validation errors to the next middleware
      return next(errorHandler(200, errors.array()));
    }
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "User not found"));
    }
    const ComparePass = bcryptjs.compareSync(password, validUser.password);
    if (!ComparePass) {
      return next(errorHandler(401, "Inavlid Credentials"));
    } else {
      const token = Jwt.sign({ id: validUser._id }, process.env.SECRET_KEY);
      const { password: pass, ...otherDeatils } = validUser._doc;

      return res.status(200).json({
        users: { otherDeatils, token },
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ===============SEND RESET PASSWORD LINK=================
export const SendResetPasswordLink = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    next(errorHandler(401, "Enter Your Email"));
  }
  try {
    const userFind = await User.findOne({ email });

    if (!userFind) {
      next(errorHandler(404, "User not found"));
    }
    const token = Jwt.sign({ id: userFind._id }, process.env.SECRET_KEY);

    const setUserToken = await User.findByIdAndUpdate(
      { _id: userFind._id },
      { verifytoken: token },
      { new: true }
    );

    if (setUserToken) {
      const mailOptions = {
        from: "ayushijain0807@gmail.com",
        to: email,
        subject: "Sending Email For Password Reset",
        text: `This Link valid For 5 MINUTES http://localhost:5050/passwordreset/${userFind._id}/${setUserToken.verifytoken}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error", error);
          res.status(401).json({ message: "email not send" });
        } else {
          console.log("Email sent" + info.response);
          res
            .status(200)
            .json({ status: 201, message: "email send successfully" });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid User" });
  }
};

// ============VERIFY USER=====================
export const VerifyUser = async (req, res, next) => {
  const { id, token } = req.params;

  try {
    const validUser = await User.findOne({ _id: id, verifytoken: token });
    if (!validUser) {
      return next(errorHandler(401, "user not found"));
    }
    res.status(200).json({ validUser });
  } catch (error) {
    next(error);
  }
};

//============RESET PASSWORD==============//
export const ResetPassword = async (req, res, next) => {
  const { id, token } = req.params;

  const { password } = req.body;
  try {
    const validUser = await User.findOne({ _id: id, verifytoken: token });

    if (!validUser) {
      return next(errorHandler(401, "user not found"));
    }
    if (!password) {
      next(errorHandler(401, "Enter new password"));
    }
    const newPassword = await bcryptjs.hashSync(password, 12);

    const setNewUserPassword = await User.findByIdAndUpdate(
      { _id: id },
      { password: newPassword }
    );
    setNewUserPassword.save();
    res.status(201).json({ status: 201, setNewUserPassword });
  } catch (error) {
    next(error);
  }
};
