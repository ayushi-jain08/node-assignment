import CryptoJS from "crypto-js";
import logger from "../Utils/pino.js";

export function encryptData(data, secretKey) {
  const encrptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encrptedData;
}

export function decryptData(data, secretKey) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);

    if (bytes.sigBytes > 0) {
      const decrpytData = bytes.toString(CryptoJS.enc.Utf8);
      return decrpytData;
    }
  } catch (error) {
    logger.error(`Error at decrypt function ${error}`);
    throw new Error("Decryption Failed Invalid Key");
  }
}
