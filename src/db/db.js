import mongoose from "mongoose";

const connectDB = async () => { //we r using async here because mongoose.connect returns a promise which takes time
    try {
        // const connectionInstance = await mongoose.connect(process.env.MongoDB_URL)
        const connectionInstance = await mongoose.connect(process.env.MongoDB_URL, { //wait here until the connection is done
            tls: true, //Use a secure/encrypted connection
            tlsInsecure: true,   // bypasses cert validation
            serverSelectionTimeoutMS: 5000 //If no connection in 5 seconds, give up
        })
        console.log(`\nMongoDB connected !! DB host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("ERROR: ", error);
        process.exit(1)
    }
}

export default connectDB;