import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Enter a valid email"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is required")
            .isLowercase()
            .withMessage("Username must be in lower case")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long"),

        body("password").trim().notEmpty().withMessage("Password is required"),

        body("fullName").optional().trim(),

    ]
}

const logInValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Enter a valid email"),

        body("password").trim().notEmpty().withMessage("Password is required")
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("New password is required"),
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
    ];
};

const userResetForgotPasswordValidator = () => {
    return [body("newPassword").notEmpty().withMessage("Password is required")];
};


const createProjectValidator = () => {
    return [
        body("name").notEmpty().withMessage("Name is required"),
        body("description").optional(),
    ];
};

const addMembertoProjectValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("role")
            .notEmpty()
            .withMessage("Role is required")
            .isIn(AvailableUserRole)
            .withMessage("Role is invalid"),
    ];
};


export {
    userRegisterValidator, logInValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    addMembertoProjectValidator,
    createProjectValidator
};