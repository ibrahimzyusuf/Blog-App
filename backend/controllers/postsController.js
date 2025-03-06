const fs=require('fs')
const path=require('path')
const asyncHandler=require('express-async-handler')
const {Post,validateCreatePost, validateUpdatePost}=require('../models/Post')
const {cloudinaryUploadPhoto, cloudinaryRemovePhoto}=require('../utils/cloudinary')
const {Comment}=require('../models/Comment')
const cloudinary=require('cloudinary')

/**
 * @desc Create new post
 * @route /api/posts
 * @method POST
 * @access private(Only logged in users)
 */

const createPostCtrl=asyncHandler(async(req,res)=>{
    // Validation for image
    if (!req.file) {
        return res.status(400).json({message:'No image provided'})
    }

    // Validation for data
    const {error}=validateCreatePost(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }
    
    // Convert the file buffer to a base64 string
    const fileBuffer = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${fileBuffer}`;

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'profile-photos',
    });

    // Create the post and save it to db
    const post=await Post.create({
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        user:req.user.id,
        image:{
            url:result.secure_url,
            publicId:result.public_id
        }
    })

    // Response
    res.status(201).json(post)
})

/**
 * @desc Get all posts
 * @route /api/posts
 * @method GET
 * @access public
 */

const getAllPostsCtrl=asyncHandler(async(req,res)=>{
    const POST_PER_PAGE=3
    const{pageNumber,category}=req.query
    let posts
    if (pageNumber) {
        posts=await Post.find().skip((pageNumber-1)*POST_PER_PAGE).limit(POST_PER_PAGE)
                        .sort({createdAt:-1}).populate('user',['-password'])
    }
    else if (category) {
        posts=await Post.find({category}).sort({createdAt:-1}).populate('user',['-password'])
    }
    else{
        posts=await Post.find().sort({createdAt:-1}).populate('user',['-password'])
    }
    res.status(200).json(posts)
})

/**
 * @desc Get single post
 * @route /api/posts/:id
 * @method GET
 * @access public
 */

const getSinglePostCtrl=asyncHandler(async(req,res)=>{
    const post=await Post.findById(req.params.id).populate('user',['-password']).populate('comments')
    if (!post) {
        return res.status(404).json({message:'Post not found'})
    }
    res.status(200).json(post)
})

/**
 * @desc Get posts count
 * @route /api/posts/count
 * @method GET
 * @access public
 */

const getPostsCountCtrl=asyncHandler(async(req,res)=>{
    const count=await Post.countDocuments()
    res.status(200).json(count)
})

/**
 * @desc Delete post
 * @route /api/posts/:id
 * @method DELETE
 * @access private(only admin or the owner of the post)
 */

const deletePostCtrl=asyncHandler(async(req,res)=>{
    // Get the post if exist
    const post=await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({message:'Post not found'})
    }

    // Authentication and delete the post
    if (req.user.isAdmin||req.user.id===post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemovePhoto(post.image.publicId)

        // @TODO delete all comments that belong to that post
        await Comment.deleteMany({postId:post._id})

        res.status(200).json({message:'Post deleted successfully',postId:post._id})
    } else {
        res.status(403).json({message:'Access denied, forbidden'})
    }
})

/**
 * @desc Update post
 * @route /api/posts/:id
 * @method PUT
 * @access private(only the owner of the post)
 */

const updatePostCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateUpdatePost(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    // Get the post if exist
    const post=await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({message:'Post not found'})
    }

    // Check if the user is the owner of the post
    if (req.user.id!==post.user.toString()) {
        return res.status(403).json({message:'Access denied, forbidden'})
    }

    // Update the post on db
    const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
        $set:{
            title:req.body.title,
            description:req.body.description,
            category:req.body.category,
        }
    },{new:true}).populate('user',['-password']).populate('comments')

    // response
    res.status(200).json(updatedPost)
})

/**
 * @desc Update post image
 * @route /api/posts/update-image/:id
 * @method PUT
 * @access private(only the owner of the post)
 */

const updatePostImageCtrl=asyncHandler(async(req,res)=>{
    // Validation
    if (!req.file) {
        return res.status(400).json({message:'No image provided'})
    }

    // Get the post if exist
    const post=await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({message:'Post not found'})
    }

    // Check if the user is the owner of the post
    if (req.user.id!==post.user.toString()) {
        return res.status(403).json({message:'Access denied, forbidden'})
    }

    // Delete the old image
    await cloudinaryRemovePhoto(post.image.publicId)

    // Convert the file buffer to a base64 string
    const fileBuffer = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${fileBuffer}`;

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'profile-photos',
    });

    // Update the imageon db
    const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
        $set:{
            image:{
                url:result.secure_url,
                publicId:result.public_id
            }
        }
    },{new:true})

    // response
    res.status(200).json(updatedPost)
})

/**
 * @desc Toggle like
 * @route /api/posts/like/:id
 * @method PUT
 * @access private(only logged in user)
 */

const toggleLikeCtrl=asyncHandler(async(req,res)=>{
    // Check if the post exist and get it from db
    let post=await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({message:'Post not found'})
    }

    // Check if the post already liked from that user
    const isAlreadyLiked=post.likes.find((user)=>user.toString()===req.user.id)
    if (isAlreadyLiked) {
        post=await Post.findByIdAndUpdate(req.params.id,{
            $pull:{likes:req.user.id}
        },{new:true})
    } else {
        post=await Post.findByIdAndUpdate(req.params.id,{
            $push:{likes:req.user.id}
        },{new:true})
    }
    res.status(200).json(post)
})

module.exports={createPostCtrl, getAllPostsCtrl,getSinglePostCtrl,
    getPostsCountCtrl,deletePostCtrl,
    updatePostCtrl, updatePostImageCtrl,toggleLikeCtrl}