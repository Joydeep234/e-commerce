import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const cloudinaryupload = async (localfilepath)=>{
  try {
    if (!localfilepath) return null;
    const uploadResult = await cloudinary.uploader.upload(localfilepath,{
        resource_type:"auto"
    })
    
    fs.unlinkSync(localfilepath)
    return uploadResult.url

  } catch (error) {
    fs.unlinkSync(localfilepath)
    return null
  }
    
}

const destroyImage = async(imageName) =>{
  try {
    if(!imageName)return null
    const removeimage = await cloudinary.uploader.destroy(imageName)
    return removeimage
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { cloudinaryupload, destroyImage };
