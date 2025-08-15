import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilepath)=>{
    try{
        if(!localfilepath) return null;
        //upload the file on cloudinary
        const response= await cloudinary.uploader.upload
        (localfilepath,{
            resource_type:"auto" //The second argument is an options object: { resource_type:"auto" }. This tells Cloudinary to automatically detect the type of file (image, video, etc.) based on its content.
        })
        //file has been uploaded successfully
        console.log("File uploaded successfully on cloudinary",response.url);
        return response;
    }
    catch(err){
        fs.unlinkSync(localfilepath);//delete the file from local storage as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary};