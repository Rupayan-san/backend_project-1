import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true,
            maxLength: 100
        }
    }, {timestamps: true}
)

export const Tweet = mongoose.model("Tweet", tweetSchema)