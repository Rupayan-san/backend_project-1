import { Router } from "express";
import { publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus, getAllVideos } from "../controllers/video.controller.js";
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

router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo)

router.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus)

router.route("/get-all-videos").get(verifyJWT, getAllVideos)

export default router