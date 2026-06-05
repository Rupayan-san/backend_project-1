import { Router } from "express";
import { toggleSubscription, getUserChannelSubscribers } from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/toggleSubscription/:channelId').get(verifyJWT, toggleSubscription)

router.route('/getUserChannelSubscribers/:channelId').get(verifyJWT, getUserChannelSubscribers)

export default router