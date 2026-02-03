import {Router} from "express";
import {registerUser , LoginUser} from "../controllers/auth.controller.js";
import {validator} from "../middlewares/validator.middleware.js";
import { userRegisterValidator, logInValidator } from "../validators/index.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validator, registerUser);
router.route("/login").post(logInValidator, validator, LoginUser);

export default router;