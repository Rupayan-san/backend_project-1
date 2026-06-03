import { Router } from "express";
import { createTweet, getUserTweets } from "../controllers/tweeet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-tweet").post(verifyJWT, createTweet)

router.route("/get-user-tweets").get(verifyJWT, getUserTweets)

export default router