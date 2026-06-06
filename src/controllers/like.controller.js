import mongoose, { isValidObjectId } from "mongoose"
import { Likes } from "../models/likes.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id
    //TODO: toggle like on video

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const like = await Likes.findOne({
        video: videoId,
        likedBy: userId
    })

    if (!like) {
        await Likes.create({
            video: videoId,
            likedBy: userId
        })

        return res
            .status(200)
            .json(new ApiResponse(200, [], "liked"))
    }

    await like.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, [], "removed like"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    const userId = req.user?._id

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "invalid comment id")
    }

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const like = await Likes.findOne({
        comment: commentId,
        likedBy: userId
    })

    if (!like) {
        await Likes.create({
            comment: commentId,
            likedBy: userId
        })

        return res
            .status(200)
            .json(new ApiResponse(200, [], "liked"))
    }

    await like.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, [], "removed like"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
    const userId = req.user?._id

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweet id")
    }

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const like = await Likes.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    if (!like) {
        await Likes.create({
            tweet: tweetId,
            likedBy: userId
        })

        return res
            .status(200)
            .json(new ApiResponse(200, [], "liked"))
    }

    await like.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, [], "removed like"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const likedVideos = await Likes.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        {
            $unwind: "$video"
        },
        {
            $replaceRoot: {
                newRoot: "$video"
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}