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
  console.log(`server is running on port ${PORT}`);
});
