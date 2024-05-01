import { check } from "express-validator";

export const registervalidator = [
  check("username", "Name is required").not().isEmpty().trim(),
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is required").not().isEmpty(),
];

export const loginvalidator = [
  check("username", "Name is required").not().isEmpty().trim(),
  check("password", "Password is required").not().isEmpty(),
];
