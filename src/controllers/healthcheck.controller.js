import {ApiResponse} from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const healthCheck = asyncHandler( (req, res, next) => {
    res
        .status(200)
        .json( new ApiResponse(200, {message : "server is running"}));
});

export {healthCheck};