const mongoose=require('mongoose')
const joi=require('joi')

const CommentSchema=new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        trim:true,
        required:true
    },
    username:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true})

// Comment model
const Comment=mongoose.model('Comment',CommentSchema)

// Validate create comment
const validateCreateComment=(obj)=>{
    const schema=joi.object({
        postId:joi.string().required().label('Post Id'),
        text:joi.string().required(),
    })
    return schema.validate(obj)
}

// Validate update comment
const validateUpdateComment=(obj)=>{
    const schema=joi.object({
        text:joi.string().required(),
    })
    return schema.validate(obj)
}

module.exports={Comment,validateCreateComment,validateUpdateComment}