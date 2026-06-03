import { Router } from "express";
import { createTweet, getUserTweets, updateTweet } from "../controllers/tweeet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-tweet").post(verifyJWT, createTweet)

router.route("/get-user-tweets").get(verifyJWT, getUserTweets)

router.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet)

export default router