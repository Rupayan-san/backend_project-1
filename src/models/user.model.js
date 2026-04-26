import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        avatar: {
            type: String, // because the photos will be stored in cloud and will be delivered in string format
            required: true
        },
        coverImage: {
            type: String,
            required: true
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "video"
            }
        ],
        password: {
            type: String,
            required: [true, 'passowrd is required']
        },
        refreshToken: {
            type: String
        }

    }, { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); //checks if the password is already encrypted cuz we dont want to encrypt repeatedly

    this.password = await bcrypt.hash(this.password, 10) // encrypts the password
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) { // making a custom method to check if the password sent by user matches our encrypted password
    return await bcrypt.compare(passowrd, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
 
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
} 


export const User = mongoose.model("User", userSchema)