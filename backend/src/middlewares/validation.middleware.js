import { body } from "express-validator";

export const reservationValidators = [
    body("tableId").isNumeric().withMessage("ID must be a number"),
    body("date").isISO8601().withMessage("Date must be a date"),
    body("time")
        .matches(/^(1[2-4]|19|2[0-2]):(00|30)$/)
        .withMessage("Invalid time"),
    body("partySize")
        .isInt({ min: 1, max: 20 })
        .withMessage("Number must be a between 1 and 20"),
    body("customer.name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),
    body("customer.email").isEmail().withMessage("Invalid email address"),
    body("customer.phone").optional(),
];

export const userValidators = [
    body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
    body("email").isEmail().withMessage("Email required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("phone").optional(),
];

export const loginValidators = [
    body("email").isEmail().withMessage("Email required"),
    body("password").exists().withMessage("Password required"),
];

export const tableValidators = [
    body("id").isNumeric().withMessage("ID must be a number"),
    body("capacity")
        .isInt({ min: 1, max: 20 })
        .withMessage("Capacity must be between 1 and 20"),
    body("type")
        .isIn(["Window", "Center", "Terrace", "Private", "Bar", "Family"])
        .withMessage("Invalid table type"),
];
