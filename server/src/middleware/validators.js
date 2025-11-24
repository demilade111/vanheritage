import { body, param, validationResult } from "express-validator";

const handleValidation = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  return next();
};

export const validate = (rules) => handleValidation(rules);

export const registerRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const createMemoryRules = [
  body("heritageSite")
    .isMongoId()
    .withMessage("A valid heritageSite id is required"),
  body("story")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Story must be at least 10 characters long"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage("Title must be between 1 and 120 characters"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("imageUrl must be a valid URL"),
];

export const updateMemoryRules = [
  param("id").isMongoId().withMessage("Invalid memory id"),
  body("story")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Story must be at least 10 characters long"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage("Title must be between 1 and 120 characters"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("imageUrl must be a valid URL"),
];

export const memoryIdParamRules = [
  param("id").isMongoId().withMessage("Invalid memory id"),
];

export const siteIdParamRules = [
  param("siteId").isMongoId().withMessage("Invalid site id"),
];

export const heritageIdParamRules = [
  param("id").isMongoId().withMessage("Invalid heritage site id"),
];
