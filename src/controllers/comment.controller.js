import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import { Video } from "../models/videos.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(404, "invalid video id")
    }

    const skip = (page - 1) * limit

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $skip: skip
        },
        {
            $limit: Number(limit)
        }
    ])

    if (!comments?.length) {
        throw new ApiError(404, "no comments")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comments, "comments fetched successfully")
    )


})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content, video, owner} = req.body

    if (!video || !isValidObjectId(video)) {
        throw new ApiError(404, "invalid video")
    }

    if (!owner || !isValidObjectId(owner)) {
        throw new ApiError(404, "invalid owner")
    }

    const comment = await Comment.create({
        content,
        video,
        owner
    })

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added succesfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {newComment} = req.body

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(404, "invalid comment id")
    }

    if (!newComment || newComment.trim() === "") {
        throw new ApiError(400, "enter a valid comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: newComment
            }
        }, {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}