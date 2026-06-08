import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/videos.model.js"
import {Subscription} from "../models/subscription.model.js"
import { Likes } from "../models/likes.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get total video views, total subscribers, total videos, total likes for a channel
    const userId = req.user?._id

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                }
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                },
                totalVideos: {
                    $sum: 1
                },
                likesCount: {
                    $sum: "$likesCount"
                }
            }
        }
    ])

    const subscribersCount = await Subscription.countDocuments({
        channel: userId
    })

    const stats = {
        ...videoStats[0],
        subscribersCount
    }

    if (!stats) {
        throw new ApiError(500, "unable to fetch stats")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, stats, "stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const videos = await Video.find({
        owner: new mongoose.Types.ObjectId(userId)
    })

    if (!videos) {
        throw new ApiError(404, "no videos")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
}