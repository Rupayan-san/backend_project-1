import { Router } from "express";
import { publishAVideo, getVideoById, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import verify from "jsonwebtoken";

const router = Router();

router.route("/publishvideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
);

router.route("/get-video/:videoId").get(verifyJWT, getVideoById)

router.route("/update-details/:videoId").patch(verifyJWT, upload.single("thumbnail"), updateVideo)

export default router