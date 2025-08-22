import {Router} from "express";
import {registeruser} from "../controllers/user.controller.js";
import {loginuser,logoutuser,refreshAccessToken} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(
    upload.fields([ // This is a middleware function (likely from a library called Multer). Before the main registration logic runs, this function intercepts the request to handle file uploads. It expects the incoming form data to contain up to two files: one named avatar and another named coverImage.
        {name:"avatar",maxcount:1},
        {name:"coverimage",maxcount:1}
    ]),
    registeruser // After the files have been processed by the middleware, this controller function is executed. It contains the core logic for validating the user's other details (like username and password), saving the user to the database, and sending back a response.
)

router.route("/login").post(loginuser)

//secured routes
router.route("/logout").post(verifyjwt,logoutuser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
