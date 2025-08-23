import {Router} from "express";
import {registeruser} from "../controllers/user.controller.js";
import {loginuser,logoutuser,refreshAccessToken} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(
    upload.fields([ // This is a middleware function (from a library called Multer). Before the main registration logic runs, this function intercepts the request to handle file uploads. It expects the incoming form data to contain up to two files: one named avatar and another named coverImage.
        {name:"avatar",maxcount:1},
        {name:"coverimage",maxcount:1}
    ]),
    registeruser // After the files have been processed by the middleware, this controller function is executed. It contains the core logic for validating the user's other details (like username and password), saving the user to the database, and sending back a response.
)

router.route("/login").post(loginuser) //API endpoints (or routes)... public route for user authentication

//secured routes
router.route("/logout").post(verifyjwt,logoutuser); //logout route

router.route("/refresh-token").post(refreshAccessToken);

export default router;


/* =>Multer's Job: The Local Handler
Multer is an Express.js middleware that acts on your server.

1) It Intercepts the Request: When a user uploads a file, it comes in a special multipart/form-data format. Multer's job is to understand this format.

2) It Saves the File Locally: It takes the file out of the request and saves it to a temporary location on your server's own hard drive (e.g., a folder named ./public/temp).

3) It Passes the Path: After saving the file, Multer attaches the file's temporary path (e.g., public/temp/image123.jpg) to the req object so the next part of your code knows where to find it.

Multer is done at this point. Its responsibility was only to get the file safely onto your server.


=> Cloudinary's Job: The Global Storage & Delivery Service
Cloudinary is a cloud-based media management service.

1) It Receives the File from Your Server: Your code (the controller function) takes the temporary file path provided by Multer and uses the Cloudinary SDK to upload that file to Cloudinary's servers.

2) It Stores the File Permanently: Cloudinary saves the file in its robust, secure cloud storage. You no longer need the temporary copy on your server.

3) It Provides a URL: Cloudinary's most important job is to return a public URL for the uploaded file (e.g., https://res.cloudinary.com/.../image.jpg). This is the URL you will save in your database.

4) It Optimizes and Delivers: It can automatically resize, crop, filter, and optimize images and then deliver them quickly to users anywhere in the world through a Content Delivery Network (CDN).


=> The Combined Workflow
Here's the step-by-step flow of how they work together:

1) A user selects an image in their browser and clicks "Upload".

2) The request hits your server. Multer (the middleware) runs first. It parses the request and saves the image to a temporary folder like ./public/temp/avatar.png.

3) Multer finishes and passes control to your controller function. Your controller now has access to the temporary file path via req.file.path.

4) Your controller calls the Cloudinary upload function, giving it the temporary path (cloudinary.uploader.upload("public/temp/avatar.png")).

5) Your server sends the file to Cloudinary. Cloudinary saves it and sends back a permanent URL.

6) Your controller saves this new URL to your database (e.g., in the user's profile).

7) Finally, your code deletes the temporary file from the ./public/temp folder on your server, as it's no longer needed.  */