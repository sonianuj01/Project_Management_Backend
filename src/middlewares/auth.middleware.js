import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import { ProjectMember } from "../models/projectmember.models.js";
import jwt from "jsonwebtoken";

// To check your access-token valid or expired
// are you login or not
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const Token = req.cookies?.accessToken
        || req.header("Authorization")?.replace("Bearer ", "");

    if (!Token) {
        return new ApiError(401, "Unauthorized request!");
    }


    try {
        const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        )

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
});


export const validateProjectPermission = (roles = []) => {
    asyncHandler(async (req, res, next) => {
        const { projectId } = req.params;

        if (!projectId) {
            throw new ApiError(400, "project id is missing");
        }

        const projectMem = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id),
        });

        if (!projectMem) {
            throw new ApiError(400, "project not found");
        }

        const givenRole = projectMem?.role;

        req.user.role = givenRole;

        if (!roles.includes(givenRole)) {
            throw new ApiError(
                403,
                "You do not have permission to perform this action",
            );
        }

        next();
    });
};

