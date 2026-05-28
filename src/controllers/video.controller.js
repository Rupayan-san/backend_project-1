import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/videos.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    if (!videoLocalPath) {
        throw new ApiError(400, "video is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    if (!videoFile || !videoFile.url) {
        throw new ApiError(500, "Error while uploading video")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail || !thumbnail.url) {
        throw new ApiError(500, "Error while uploading thumbnail")
    }

    const owner = req.user?._id
    if (!owner) {
        throw new ApiError(401, "unauthorized")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        isPublished: true,
        videoPublicId: videoFile.public_id,
        thumbnailPublicId: thumbnail.public_id,
        owner
    })

    if (!video || !video._id) {
        throw new ApiError(500, "Video publishing failed")
    }

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "valid video id is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "valid video id is required")
    }

    const {title, description} = req.body

    const updateFields = {}

    if (title?.trim()) {
        updateFields.title = title
    }

    if (description?.trim()) {
        updateFields.description = description
    }

    if (req.file) {
        const thumbnailLocalPath = req.file?.path
        if (!thumbnailLocalPath) {
            throw new ApiError(400, "thumbnail path not found")
        }

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if (!thumbnail) {
            throw new ApiError(400, "error while uploading thumbnail in cloudinary")
        }
        updateFields.thumbnail = thumbnail.url
        updateFields.thumbnailPublicId = thumbnail.public_id
    }
    
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        },
        { returnDocument: "after" }
    )

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "update successful")
    )
    

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "video not found")
    }

    await deleteFromCloudinary(video?.videoPublicId, "video")
    await deleteFromCloudinary(video?.thumbnailPublicId, "image")
    
    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if (!deletedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedVideo, "video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "valid video id is required")
    }
    
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(200, video, `video is now ${video.isPublished ? "published" : "unpublished"}`))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}