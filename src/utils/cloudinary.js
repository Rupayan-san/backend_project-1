import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload
        (localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        fs.unlinkSync(localFilePath) // Deletes the locally saved temporary file as we don't want to make a hub of all those files in my local system 
        return response
    }
    catch(error){
        console.log("Cloudinary Upload Error:", error);
        fs.unlinkSync(localFilePath) //Remove the locally saved temporary file as the Operation got failed
        return null
    }
}

export {uploadOnCloudinary}