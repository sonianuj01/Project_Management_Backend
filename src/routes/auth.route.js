import { Router } from "express";
import {
    registerUser,
    LoginUser,
    LogOutUser,
    verifyEmail,
    getCurrentUser,
    refreshAccessToken,
    resendEmailVerification,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword
} from "../controllers/auth.controller.js";
import { validator } from "../middlewares/validator.middleware.js";
import { 
    userRegisterValidator, logInValidator, 
    userChangeCurrentPasswordValidator, 
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unsecured route
router.route("/register").post(userRegisterValidator(), validator, registerUser);
router.route("/login").post(logInValidator(), validator, LoginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
    .route("/forgot-password")
    .post(userForgotPasswordValidator(), validator, forgotPasswordRequest);
router
    .route("/reset-password/:resetToken")
    .post(userResetForgotPasswordValidator(), validator, resetForgotPassword);

//secure routes
router.route("/logout").post(verifyJWT, LogOutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router
    .route("/change-password")
    .post(
        verifyJWT,
        userChangeCurrentPasswordValidator(),
        validator,
        changeCurrentPassword,
    );
router
    .route("/resend-email-verification")
    .post(verifyJWT, resendEmailVerification);


export default router;