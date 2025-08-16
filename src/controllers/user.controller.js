import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {user} from  "../models/user.model.js"; // Assuming you have a user model defined
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registeruser= asyncHandler(async(req,res)=>{
    const {fullname,email,username,password} = req.body
    console.log("email: ",email);

    if(
        [fullname,email,username,password].some((field)=>
            field?.trim()=== "")
    ){
        throw new ApiError(400,"all field are required")
    }

    const existeduser=user.findOne({
        $or:[{ username },{ email }]
    })

    if(existeduser){
        throw new ApiError(409,"user already exists")
    }

    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverimagelocalpath=req.files?.coverimage[0]?.path;

    if(!avatarlocalpath){
        throw new ApiError(400,"avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarlocalpath);
    const coverimage=await uploadOnCloudinary(coverimagelocalpath);

    if(!avatar){
        throw new ApiError(400,"avatar upload failed")
    }

    const user=await user.create({
        fullname:fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })

    const createduser=await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500,"something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    )
})

export {
    registeruser
};




//steps for registering users
//1) get the user data from the request body
//2) validate the user data
//3) check if the user already exists :username/email
//4) check for images ,check for avatar 
//5) upload them to cloudinary,avatar
//6) create user object - create entry in db
//7) remove password and refresh token field from response
//8) check for user creation 
//9) return response 

