import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getUserPlaylists } from "../controllers/playlist.controller.js";
import { Router } from "express";

const router = Router()

router.route("/createPlaylist").post(verifyJWT, createPlaylist)

router.route("/getUserPlaylists/:userId").get(verifyJWT, getUserPlaylists)



export default router;