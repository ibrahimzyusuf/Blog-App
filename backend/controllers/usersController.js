const asyncHandler=require('express-async-handler')
const bcrypt=require('bcryptjs')
const {User, validateUpdateUser}=require('../models/User')
const {Post}=require('../models/Post')
const {Comment}=require('../models/Comment')
const path=require('path')
const { cloudinaryUploadPhoto, cloudinaryRemovePhoto, cloudinaryRemoveMultiblePhotos} = require('../utils/cloudinary')
const fs=require('fs')
const cloudinary=require('cloudinary')

/**
 * @desc Get all users profiles
 * @route /api/users/profiles
 * @method GET
 * @access Private(only admin)
 */

const getAllUsersProfilesCtrl=asyncHandler(async(req,res)=>{
    const users=await User.find().select('-password').populate('posts')
    res.status(200).json(users)
})

/**
 * @desc Get user profile
 * @route /api/users/profile/:id
 * @method GET
 * @access Public
 */

const getUserProfileCtrl=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select('-password').populate('posts')
    if (!user) {
        return res.status(404).json({message:'User not found'})
    }
    res.status(200).json(user)
})

/**
 * @desc Update user profile
 * @route /api/users/profile/:id
 * @method PUT
 * @access Private(only user himself)
 */

const updateUserProfileCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateUpdateUser(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }
    
    // Check if the password passed and hash it
    if (req.body.password) {
        const salt=await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password,salt)
    }
    
    // Update the user profile
    const updatedUser=await User.findByIdAndUpdate(req.params.id,
        {$set:{
            userName:req.body.userName,
            password:req.body.password,
            bio:req.body.bio,
        }},{new:true}).select('-password').populate('posts')

    res.status(200).json(updatedUser)
})

/**
 * @desc Get users count
 * @route /api/users/count
 * @method GET
 * @access Private(only admin)
 */

const getUsersCountCtrl=asyncHandler(async(req,res)=>{
    const count=await User.countDocuments()
    res.status(200).json(count)
})

/**
 * @desc Upload profile photo
 * @route /api/users/profile/profile-photo-upload
 * @method POST
 * @access Private(only logged in)
 */

const profilePhotoUploadCtrl=asyncHandler(async(req,res)=>{
    // Validation
    if (!req.file) {
        return res.status(400).json({message:'No file provided'})
    }

    // Get the image from local and upload it to cloudinary
    /* const imagePath=path.join(__dirname,`../images/${req.file.filename}`)
    const result=await cloudinaryUploadPhoto(imagePath)
    console.log(result) */

    // Convert the file buffer to a base64 string
    const fileBuffer = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${fileBuffer}`;

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'profile-photos',
    });

    // Get the user he want to upload his profile photo and check if he has an old profile photo to delete it
    const user=await User.findById(req.user.id)
    if (user.profilePhoto.publicId!==null) {
        await cloudinaryRemovePhoto(user.profilePhoto.publicId)
    }

    // Change his photo on DB
    user.profilePhoto=({
        url:result.secure_url,
        publicId:result.public_id
    })
    await user.save()

    // Response
    res.status(200).json({message:'Your profile photo uploaded successfully',
    profilPhoto:{url:result.secure_url,publicId:result.public_id}})

    // Remove the image from local
    // fs.unlinkSync(imagePath)
})

/**
 * @desc Delete user profile(Account)
 * @route /api/users/profile/:id
 * @method DELETE
 * @access Private(only admin or user himself)
 */

const deleteUserProfileCtrl=asyncHandler(async(req,res)=>{
    // Get the user from db
    const user =await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({message:'User not found'})
    }

    // Get all posts that belong to that user from db
    const posts=await Post.find({user:user._id})

    // Get the public ids from the posts
    const publicIds=posts?.map((post)=> post.image.publicId)

    // Delete the photos of the posts from cloudinary
    if (publicIds?.length>0) {
    await cloudinaryRemoveMultiblePhotos(publicIds)
        
    }
    // Delete the profile photo from cloudinary
    if (user.profilePhoto.publicId!==null) {
    await cloudinaryRemovePhoto(user.profilePhoto.publicId)
    }

    // Delete all posts and comments that belong to that user
    await Post.deleteMany({user:user._id})
    await Comment.deleteMany({user:user._id})

    // Delete the user from db
    await User.findByIdAndDelete(req.params.id)

    // Response
    res.status(200).json({message:'Profile deleted successfully'})
})

module.exports={getAllUsersProfilesCtrl,getUserProfileCtrl,
    updateUserProfileCtrl,
    getUsersCountCtrl,profilePhotoUploadCtrl,
    deleteUserProfileCtrl}