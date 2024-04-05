import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'       
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


  const uploadOnCloudinary=async(localFilePath)=>{
    console.log("Before try of upload on cloudinary");
    try {
      console.log("Local file path from uploadCloudinary:",localFilePath);
    if (!localFilePath) return null
     const response=await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'})  //file uploaded
     console.log("File uploaded successfully",response.url);
     fs.unlinkSync(localFilePath) //remove file from server 
     return response
    } catch (error) {
        console.log("Error on cloudinary",error);
        fs.unlinkSync(localFilePath);  //remove the locally saved temporary file as upload operation got failed
        return null
    }
  }

  export {uploadOnCloudinary}