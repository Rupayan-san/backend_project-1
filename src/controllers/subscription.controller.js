import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { channel } from "diagnostics_channel"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user?._id

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channel id")
    }

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const subscription = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    })

    if (!subscription) {
        await Subscription.create({
            subscriber: new mongoose.Types.ObjectId(userId),
            channel: new mongoose.Types.ObjectId(channelId)
        })

        return res
            .status(200)
            .json(new ApiResponse(200, [], "subscription added"))
    }

    await subscription.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, [], "subscription removed"))

    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!channelId) {
        throw new ApiError(400, "invalid channel id")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project: {
                subscriber: 1
            }
        }
    ])

    if (!subscribers.length) {
        throw new ApiError(404, "no subscribers")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "subscriber list"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}