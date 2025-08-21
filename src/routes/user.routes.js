import {Router} from "express";
import {registeruser} from "../controllers/user.controller.js";
import {loginuser,logoutuser,refreshAccessToken} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },
        {
            name:"coverimage",
            maxcount:1
        }
    ]),
    registeruser
)

router.route("/login").post(loginuser)

//secured routes
router.route("/logout").post(verifyjwt,logoutuser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
