const cloudinary=require('cloudinary')

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

// Cloudinary upload photo
const cloudinaryUploadPhoto=async(imageToUpload)=>{
    try {
        const data=await cloudinary.uploader.upload(imageToUpload,{resource_type:'auto'})
        return data
    } catch (error) {
        console.log(error)
        throw new Error('Internal Server Error (cloudinary)')
    }
}

// Cloudinary remove photo
const cloudinaryRemovePhoto=async(imagePublicId)=>{
    try {
        const result=await cloudinary.uploader.destroy(imagePublicId)
        return result
    } catch (error) {
        console.log(error)
        throw new Error('Internal Server Error (cloudinary)')
    }
}

// Cloudinary remove multible photos
const cloudinaryRemoveMultiblePhotos=async(imagePublicIds)=>{
    try {
        const result=await cloudinary.v2.api.delete_resources(imagePublicIds)
        return result
    } catch (error) {
        console.log(error)
        throw new Error('Internal Server Error (cloudinary)')
    }
}

module.exports={cloudinaryUploadPhoto,cloudinaryRemovePhoto,cloudinaryRemoveMultiblePhotos}