import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { getChannelStats } from "../controllers/dashboard.controller.js"

const router = Router()

router.route("/getChannelStats").get(verifyJWT, getChannelStats)


export default router