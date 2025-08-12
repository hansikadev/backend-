import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})
connectDB()


//approch to connect mongodb with mongoose 1
// import express from "express";
// const app=express();
// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("error connecting to database",error);
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port ${process.env.PORT}`);
//         })
//     }
//     catch(error){
//         Console.error("ERROR",error);
//         throw error;
//     }
// })()