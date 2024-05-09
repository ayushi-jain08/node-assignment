import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import Res from '../Services/general.hepler.js';
import httpCode from '../Config/httpConstant.config.js';
import logger from '../Utils/pino.js';
dotenv.config();

const authtoken = async (req, res, next) => {
    let token;
    token = req.headers.authorization;
    if (!token) {
        return Res(res, httpCode.forbidden_code, "Authentication failed");
    }
    token = token.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            logger.error(`Error at auth.middleware authenticateToken ${err}`)
            return Res(res, httpCode.forbidden_code, "Authentication failed");
        }
        req.user = user;
        next();
    });
}

export default authtoken
