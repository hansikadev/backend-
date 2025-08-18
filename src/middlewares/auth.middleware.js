import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { user } from "../models/user.model.js"; // Assuming you have a user model defined
import jwt from "jsonwebtoken";

export const verifyjwt=asyncHandler(async(req,_,next)=>{
    try{
        const token=req.cookies?.accesstoken || req.headers("authorization")?.replace("Bearer ","");

        if(!token){
            throw new ApiError(401,"unauthorized request!")
        }

        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user2=await user.findById(decodedtoken?._id).select("-password -refreshtoken")
    
        if(!user2){
            throw new ApiError(401,"invalid access tokent!")
        }

        //user exists
        req.user=user2;
        next();             
    }
    catch (error) {
        // Optionally, you can handle the error here or just rethrow
        throw new ApiError(401,error?.message || "invalid access token");
    }
}) ;