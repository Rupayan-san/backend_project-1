import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }
        console.log("Uploading file from:", localFilePath);
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("Upload successful:", response.url);
        //file has been uploaded successfully
        fs.unlinkSync(localFilePath) // Deletes the locally saved temporary file as we don't want to make a hub of all those files in our local system 
        return response
    }
    catch (error) {
        console.error("Cloudinary Upload Error - Full Details:");
        console.error("Message:", error.message);
        console.error("Code:", error.http_code);
        console.error("Status:", error.status);
        console.error("Full error:", error);
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (e) {
            console.error("Error deleting file:", e.message);
        }
        return null
    }
}

export { uploadOnCloudinary }