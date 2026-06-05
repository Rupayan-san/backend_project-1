import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist } from "../controllers/playlist.controller.js";
import { Router } from "express";

const router = Router()

router.route("/createPlaylist").post(verifyJWT, createPlaylist)

router.route("/getUserPlaylists/:userId").get(verifyJWT, getUserPlaylists)

router.route("/getPlaylistById/:playlistId").get(verifyJWT, getPlaylistById)

router.route("/addVideoToPlaylist/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist)



export default router;