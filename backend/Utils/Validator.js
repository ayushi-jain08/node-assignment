import { check, param } from "express-validator";

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

export const postValidator = [
  check("photo")
    .custom((value, { req }) => {
      // Check if req.files.photo exists in the request body
      if (!req.files || !req.files.photo) {
        throw new Error("Image file is required in the request body");
      }
      return true;
    }),
  check("title")
    .optional({ nullable: true })
    .isString()
    .withMessage("Title must be a string")
    .trim(),
];

export const commentValidator = [
  param("postId")
    .notEmpty()
    .withMessage("Post ID is required")
    .isMongoId()
    .withMessage("Invalid Post ID"),
  check("text", "text is required").not().isEmpty().trim(),
  check("parent")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid Parent Comment ID")
]