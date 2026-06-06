import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos } from "../controllers/like.controller.js"

const router = Router()

router.route("/toggleVideoLike/:videoId").get(verifyJWT, toggleVideoLike)

router.route("/toggleCommentLike/:commentId").get(verifyJWT, toggleCommentLike)

router.route("/toggleTweetLike/:tweetId").get(verifyJWT, toggleTweetLike)

router.route("/getLikedVideos").get(verifyJWT, getLikedVideos)


export default router;