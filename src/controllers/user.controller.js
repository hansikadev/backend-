import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {user} from  "../models/user.model.js"; // Assuming you have a user model defined
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(user1Id)=> {
    try{
        const user1 = await user.findById(user1Id);
        const accesstoken=user1.generateAccessToken()
        const refreshtoken=user1.generateRefreshToken()

        user1.refreshtoken=refreshtoken;
        await user1.save({validateBeforeSave:false});

        return {accesstoken, refreshtoken};
    }
    catch(err){
        throw new ApiError(500, "something went wrong while generating refresh and access token");
    }
}


const registeruser= asyncHandler(async(req,res)=>{
    // 1. Get user data from the request body
    const {fullname,email,username,password} = req.body
    console.log("email: ",email);

     // 2. Validate the user data
    if(
        [fullname,email,username,password].some((field)=> //.some() is an array method that returns true if at least one of the items in the array passes the test inside it.
            field?.trim()=== "")
    ){
        throw new ApiError(400,"all field are required")
    } 

    //3) check if the user already exists :username/email
    const existeduser=await user.findOne({
        $or:[{ username },{ email }]
    })
    if(existeduser){
        throw new ApiError(409,"user already exists")
    }

    //4) check for images ,check for avatar 
    const avatarlocalpath=req.files?.avatar[0]?.path;
    //const coverimagelocalpath=req.files?.coverimage[0]?.path;

    let coverimagelocalpath;
    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
        coverimagelocalpath=req.files.coverimage[0].path;
    }

    if(!avatarlocalpath){
        throw new ApiError(400,"avatar file is required")
    }
 
    //5) upload them to cloudinary,avatar
    const avatar=await uploadOnCloudinary(avatarlocalpath);
    const coverimage=await uploadOnCloudinary(coverimagelocalpath);

    if(!avatar){
        throw new ApiError(400,"avatar upload failed")
    }

    // Step 6, 7, 8: Create User, Sanitize, and Check
    const newuser=await user.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })

    const createduser=await user.findById(newuser._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500,"something went wrong while registering the user")
    }

    //9) return response 
    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    )
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
})


//login user
const loginuser= asyncHandler(async(req,res)=>{
    //req body-> data
    // username and email
    //find the user
    //check for password match
    //generate acess and refresh token
    //send cookie

    //1) req body-> data
    const {email,username,password}= req.body
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    //2) username and email
    const user1= await user.findOne({
        $or:[{username},{email}]
    })

    //3) find the user
    if(!user1){
        throw new ApiError(404,"user not exist")
    }

    //4) check for password match
    const isPasswordValid=await user1.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404,"invalid user credentials")
    }

    //5) generate acess and refresh token
    const {accesstoken,refreshtoken}=await generateAccessAndRefreshTokens(user1._id)

    const loggedinuser=await user.findById(user1._id).select("-password -refreshtoken");
    

    //6) send cookie
    const options={
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedinuser, accesstoken, refreshtoken 
            },
            "user logged in successfully"
        )           
    )
})


//log out user
const logoutuser=asyncHandler(async(req,res)=>{
    user.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtoken:undefined
            }
        },
        {
            new:true
        }
    )


    const options={
        httpOnly: true,
        secure:true
    }

    //clear cookies
    return res
    .status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(new ApiResponse(200, {}, "user logged out successfully"))

})


const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshtoken || req.body.refreshtoken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request!")
    }

    //verify the refresh token
    try{    
        const decodedtoken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        const user=await user.findById(decodedtoken._id)

        if(!user){
            throw new ApiError(401,"invalid refresh token !")
        }

        if(user?.refreshtoken !== incomingRefreshToken){
            throw new ApiError(401,"refresh token is expired or used!")
        }

        const options ={
            httpOnly: true,
            secure:true
        }

        //generate new access token
        const {accesstoken,newrefreshtoken}=await generateAccessAndRefreshTokens(user._id);

        return res
        .status(200)
        .cookie("accesstoken",accesstoken, options)
        .cookie("refreshtoken",newrefreshtoken, options)
        .json(          
            new ApiResponse(
                200, 
                {accesstoken,refreshtoken: newrefreshtoken},
                "new access token generated successfully"
            )
        )
    }   
    catch(err){
        throw new ApiError(401,err?.message || "invalid refresh token !")
    }

})

export {
    registeruser,
    loginuser,
    logoutuser,
    refreshAccessToken
};



