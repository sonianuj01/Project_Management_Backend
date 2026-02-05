import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import  jwt  from "jsonwebtoken";

// To check your access-token valid or expired
export const verifyJWT = asyncHandler( async (req,res,next) => {
    const Token = req.cookies?.accessToken 
    || req.header("Authorization")?.replace("Bearer ","");

    if(!Token){
        return new ApiError(401, "Unauthorized request!");
    }


    try {
        const decodedToken = jwt.verify(Token , process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        )

        if(!user){
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
});
