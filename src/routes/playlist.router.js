import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist } from "../controllers/playlist.controller.js";
import { Router } from "express";

const router = Router()

router.route("/createPlaylist").post(verifyJWT, createPlaylist)



export default router;