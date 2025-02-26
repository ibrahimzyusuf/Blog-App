const asyncHandler=require('express-async-handler')
const {Comment,validateCreateComment,validateUpdateComment}=require('../models/Comment')
const {User}=require('../models/User')

/**
 * @desc Create new comment
 * @route /api/comments
 * @method POST
 * @access private(Only logged in users)
 */

const createCommentCtrl=asyncHandler(async(req,res)=>{
    // Validation 
    const {error}=validateCreateComment(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    const user=await User.findById(req.user.id)

    const comment=await Comment.create({
        postId:req.body.postId,
        text:req.body.text,
        user:req.user.id,
        username:user.userName
    })
    
    // Response
    res.status(201).json(comment)
})

/**
 * @desc Get all comments
 * @route /api/comments
 * @method GET
 * @access private(Only admin)
 */

const getAllCommentsCtrl=asyncHandler(async(req,res)=>{
    const comments=await Comment.find().populate('user',['-password'])
    res.status(200).json(comments)
})

/**
 * @desc Delete comment
 * @route /api/comments/:id
 * @method DELETE
 * @access private(Only admin or the owner of the comment)
 */

const deleteCommentCtrl=asyncHandler(async(req,res)=>{
    // Check if the comment exist and bring it
    const comment=await Comment.findById(req.params.id)
    if (!comment) {
        return res.status(404).json({message:'Comment not found'})
    }

    // Validation
    if (req.user.isAdmin||req.user.id===comment.user.toString()) {
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({message:'Comment deleted successfully'})
    } else {
        return res.status(403).json({message:'Access denied, not allowed'})
    }
})

/**
 * @desc Update comment
 * @route /api/comments/:id
 * @method PUT
 * @access private(Only the owner of the comment)
 */

const updateCommentCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateUpdateComment(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    // Check if the comment exist
    let comment=await Comment.findById(req.params.id)
    if (!comment) {
        return res.status(404).json({message:'Comment not found'})
    }

    // Authentication if it is the user
    if (req.user.id!==comment.user.toString()) {
        return res.status(403).json({message:'Access denied, only the owner of the comment'})
    } else {
        comment=await Comment.findByIdAndUpdate(req.params.id,{
            $set:{
                text:req.body.text
            }
        },{new:true})
        res.status(200).json(comment)
    }
})

module.exports={createCommentCtrl,getAllCommentsCtrl,deleteCommentCtrl,updateCommentCtrl}