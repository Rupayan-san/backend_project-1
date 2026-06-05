import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getUserPlaylists, getPlaylistById } from "../controllers/playlist.controller.js";
import { Router } from "express";

const router = Router()

router.route("/createPlaylist").post(verifyJWT, createPlaylist)

router.route("/getUserPlaylists/:userId").get(verifyJWT, getUserPlaylists)

router.route("/getPlaylistById/:playlistId").get(verifyJWT, getPlaylistById)



export default router;