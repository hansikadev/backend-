import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser" ;

const app=express(); //This line creates the actual server application. The app object is what you'll use to configure everything—what kind of data to accept, what security to use, and what routes to listen for.

app.use(cors({
    origin: process.env.CORS_ORIGIN, //origin: Specifies which frontend URL is allowed to make requests to this server. Using process.env.CORS_ORIGIN makes it configurable and secure, so you're not just letting any website on the internet access your API.
    credentials: true // Allows the frontend to send cookies with its requests, which is essential for authentication.

}))
app.use(express.json({limit:"16kb"})); //Lets the server accept and understand data in JSON format, which is the standard for modern APIs.
app.use(express.urlencoded({extended:true,limit:"16kb"})) //express.urlencoded(): Lets the server understand data sent from traditional HTML forms.  , limit:"16kb": A security measure to prevent users from crashing your server by sending massive amounts of data.
app.use(express.static("public")); // This tells the server to serve any static files (like images, CSS, or HTML files) directly from a folder named public.
app.use(cookieParser()) //This activates the cookie-parsing middleware, making it easy to access cookie data in your route handlers (via req.cookies).

//routes import  
import userRouter from "./routes/user.routes.js"; //import userRouter: Instead of defining all user-related routes (like /login, /register, /logout) directly in this file, you've organized them into a separate file (./routes/user.routes.js). This keeps your code clean.

//routes declaration
app.use("/api/v1/users",userRouter) //app.use("/api/v1/users", userRouter): This is the key part. It tells the server: "If you receive any request where the URL starts with /api/v1/users, pass that request over to the userRouter to handle it."
//For example, if the userRouter has a /register route defined, the full API endpoint for a user to register would be /api/v1/users/register.

export {app};  