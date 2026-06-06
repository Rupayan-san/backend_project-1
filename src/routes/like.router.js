import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { toggleVideoLike, toggleCommentLike } from "../controllers/like.controller.js"

const router = Router()

router.route("/toggleVideoLike/:videoId").get(verifyJWT, toggleVideoLike)

router.route("/toggleCommentLike/:commentId").get(verifyJWT, toggleCommentLike)


export default router;