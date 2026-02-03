import {body} from "express-validator";

const userRegisterValidator = () =>{
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


export {userRegisterValidator,logInValidator};