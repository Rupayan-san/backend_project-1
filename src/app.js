import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: 'true', limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParser())


//route import
import userRouter from './routes/user.router.js'
import videoRouter from './routes/video.router.js'
import commentRouter from './routes/comment.router.js'
import tweetRouter from './routes/tweet.router.js'
import subscriptionRouter from './routes/subscription.router.js'
import playlistRouter from './routes/playlist.router.js'
import likeRouter from './routes/like.router.js'
import dashboardRouter from './routes/dashboard.router.js'
import {healthcheck} from './controllers/healthcheck.controller.js'


// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheck)

// global error handler - must be after all routes
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    })
})

export { app }
