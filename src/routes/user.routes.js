import {Router} from "express";
import {registeruser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

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
export default router;
