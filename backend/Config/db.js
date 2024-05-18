import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../Utils/pino.js";
dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION);
    logger.info(`mongodb connect successfully`);
  } catch (error) {
    logger.info(`error in mongodb ${error}`);
  }
};

export default connectDB;
