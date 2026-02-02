import {ApiResponse} from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import {emailVerificationMailgenContent, sendEmail} from "../utils/mail.js";
import { User } from "../models/user.model.js";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
    } catch (error) {
    throw new ApiError(
        500,
        "Something went wrong while generating access token",
    );
    }
};

const registerUser = asyncHandler(async (req,res) => {
    const {username, email, password} = req.body;

    const existedUser = await User.findOne(
        {$or : [{username}, {email}]}
    );

    if(existedUser){
        throw new ApiError(500, "User already exists");
    }

    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified : false
    });

    const {unHashedToken, hashedToken, tokenExpiry} = await user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave : false});

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent : emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email",
        ),
    );

    
});




export { registerUser };