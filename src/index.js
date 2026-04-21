import dotenv from "dotenv"
import express from "express"
import { connect } from "mongoose"
import connectDB from "./db/db.js"
dotenv.config()

const app = express()

console.log(process.env.MongoDB_URL)
connectDB()

.then(() => {
    app.on("error", (error) => {
        console.log(`Error: ${error}`);
        throw error;
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT:${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.log("MongoDB connection failed !!!", error);
    
})


/*
(async() => {
    try{
        await mongoose.connect(`${process.env.MongoDB_URL}/${DB_name}`)
        app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })
    }catch(error){
        console.error("ERROR:", error)
        throw error
    }
})()
*/
