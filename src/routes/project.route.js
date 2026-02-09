import {Router} from "express" ;
import { createProject } from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/create-project").post(verifyJWT, createProject)


export default router;