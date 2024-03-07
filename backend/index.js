import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
dotenv.config();
import user from "./Routes/User.js";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//======================ROUTES=======================//
app.use("/api/user", user);

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
