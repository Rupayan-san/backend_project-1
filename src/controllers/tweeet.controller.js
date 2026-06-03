import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const ownerId = req.user?._id
    const {content} = req.body

    if (!ownerId || !isValidObjectId(ownerId)) {
        throw new ApiError(400, "invalid ownerId")
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "content cannot be empty")
    }

    if (content.length > 100) {
        throw new ApiError(400, "content length should be within 100")
    }

    const tweet = await Tweet.create({
        owner: ownerId,
        content
    })

    if (!tweet) {
        throw new ApiError(500, "failed to create tweet")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, tweet, "tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const ownerId = req.user?._id

    if (!ownerId || !isValidObjectId(ownerId)) {
        throw new ApiError(400, "invalid owner id")
    }
    
    const tweets = await Tweet.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(ownerId)
            }
        }
    ])

    if(!tweets?.length){
        throw new ApiError(404, "no tweets found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const ownerId = req.user?._id
    const {tweetId} = req.params
    const {newContent} = req.body

    if (!ownerId || !isValidObjectId(ownerId)) {
        throw new ApiError(400, "invalid owner id")
    }

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweet id")
    }

    if (!newContent || !newContent.trim()) {
        throw new ApiError(400, "content cannot be empty")
    }

    if (newContent.length > 100) {
        throw new ApiError(400, "content length should be within 100")
    }

    const updatedContent = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content: newContent
            }
        }, {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedContent, "content updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}