import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description = ""} = req.body
    const ownerId = req.user?._id
    //TODO: create playlist

    if (!ownerId || !isValidObjectId(ownerId)) {
        throw new ApiError(400, "invalid owner id")
    }

    if (!name || !name.trim()) {
        throw new ApiError(400, "enter valid name")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: new mongoose.Types.ObjectId(ownerId)
    })

    if (!playlist) {
        throw new ApiError(500, "failed to create playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                name: 1,
                description: 1
            }
        }
    ])

    if (!playlists.length) {
        throw new ApiError(404, "no playlists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const addedVideo = await Playlist.findByIdAndUpdate(playlistId,
        {
            $addToSet:{
                videos: new mongoose.Types.ObjectId(videoId)
            }
        }, {new: true}
    )

    if (!addedVideo) {
        throw new ApiError(500, "failed to add video to playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, addedVideo, "video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const removedVideo = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull:{
                videos: new mongoose.Types.ObjectId(videoId)
            }
        }, {new: true}
    )

    if (!removedVideo) {
        throw new ApiError(500, "failed to delete video from playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, removedVideo, "video deleted from playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}