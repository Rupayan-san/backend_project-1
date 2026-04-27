import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler (async (req, res) => {
    const {userName, email, password, fullName} = req.body
    // console.log("username:", userName);

    // checking if the following fields are acceptable or not
    if (
        [fullName, email, userName, password].some((field) => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{userName}, {email}] //Return documents where at least one condition is true.
    })
    if (existedUser){
        throw new ApiError(409, "User with this email or username already exists.")
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path; //getting the path of our image

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is mandatory")
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath) //uploaded the files on cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar image is mandatory")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken") // to check whether our user object is created or not

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered succesfully")
    )
})


export {registerUser}