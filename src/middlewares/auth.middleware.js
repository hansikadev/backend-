import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { user } from "../models/user.model.js"; // Assuming you have a user model defined
import jwt from "jsonwebtoken";

export const verifyjwt=asyncHandler(async(req,_,next)=>{ 
    try{ //find the token
        const token=req.cookies?.accesstoken || req.headers("authorization")?.replace("Bearer ","");  //The code first tries to find the JSON Web Token (JWT). It looks in two common places: req.cookies?.accesstoken: In an HTTP-only cookie named accesstoken. req.header("Authorization"): In the Authorization header (and it cleans up the "Bearer " prefix).

        if(!token){
            throw new ApiError(401,"unauthorized request!") //If no token is found in either place, it throws a 401 Unauthorized error.
        }

        //verify the token 
        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET); //This is the core of the verification. The jwt.verify function does three things: 1)Checks if the token's signature is valid using your secret key. This proves it hasn't been tampered with. 2)Checks if the token has expired. 3)If both checks pass, it decodes the token, revealing the payload (the data stored inside, like the user's ID).

        //check the db -> does the user still exists
        const user2=await user.findById(decodedtoken?._id).select("-password -refreshtoken") //Just because the token is valid doesn't mean the user still exists. The user might have been deleted after the token was issued. This step takes the user's ID from the decoded token and checks if a user with that ID actually exists in the database.
    
        if(!user2){
            throw new ApiError(401,"invalid access token !")
        }

        //user exists
        req.user=user2; //It attaches the authenticated user's information (minus the password and refresh token) to the req object.
        next();  // This function passes control to the next function in the chain, which is usually the main controller that handles the actual logic for that route (e.g., changeCurrentPassword). Now, that controller will have access to req.user and know who is making the request.     
    }
    catch (error) {
        // Optionally, you can handle the error here or just rethrow
        throw new ApiError(401,error?.message || "invalid access token");
    }
}) ;


//This code is an authentication middleware function named verifyJWT. Its primary job is to protect routes by acting as a security guard for your API. It checks if a request comes from a logged-in, authenticated user before allowing them to access a protected endpoint.