import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
dotenv.config();
import user from "./Routes/User.js";
import cors from "cors";
import post from './Routes/Post.js'
import fileUpload from 'express-fileupload'
import comment from './Routes/Comment.js'
import { sendError } from "./Services/general.hepler.js";
import httpCode from "./Config/httpConstant.config.js";
import logger from "./Utils/pino.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//======================ROUTES=======================//
app.use("/api/user", user);
app.use("/api/post", post);
app.use("/api/comment", comment)

app.use((req, res, next) => {
  sendError(res, httpCode.not_found_error, 'Resource Not Found')
})

//=====================Error Handling Middleware========================//
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
connectDB();
const PORT = process.env.PORT || 7000;

app.listen(PORT, async () => {
  logger.info(`server is running on port ${PORT}`);
});
