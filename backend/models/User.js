const mongoose=require('mongoose')
const joi=require('joi')
const passwordComplexity=require('joi-password-complexity')
const jwt=require('jsonwebtoken')

const UserSchema=new mongoose.Schema(
    {
        userName:{
            type:String,
            trim:true,
            minlength:2,
            maxlength:80,
            required:true
        },
        email:{
            type:String,
            trim:true,
            minlength:5,
            maxlength:100,
            unique:true,
            required:true
        },
        password:{
            type:String,
            trim:true,
            minlenght:8,
            required:true,
        },
        profilePhoto:{
            type:Object,
            default:{
                url:'../../frontend/public/images/user-avatar.png',
                publicId:null,
            }
        },
        bio:String,// <=> bio:{ type:String } beacause it has a single line
        isAdmin:{
            type:Boolean,
            default:false
        },
        isAccountVerified:{
            type:Boolean,
            default:false
        },
    },{timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    })

// Populate posts that belong to the user
UserSchema.virtual('posts',{
    ref:'Post',
    foreignField:'user',
    localField:'_id'
})

// Generate auth token
UserSchema.methods.generateAuthToken=function () {
    return jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.JWT_SECRET)
}

// User model
const User=mongoose.model('User',UserSchema)

// Validate register user
const validateRegisterUser=(obj)=>{
    const schema=joi.object({
        userName:joi.string().trim().min(2).max(80).required(),
        email:joi.string().trim().min(5).max(100).email().required(),
        password:passwordComplexity().required()
    })
    return schema.validate(obj)
}

// Validate login user
const validateLoginUser=(obj)=>{
    const schema=joi.object({
        email:joi.string().trim().min(5).max(100).email().required(),
        password:joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}

// Validate update user
const validateUpdateUser=(obj)=>{
    const schema=joi.object({
        userName:joi.string().trim().min(2).max(80),
        password:passwordComplexity(),
        bio:joi.string()
    })
    return schema.validate(obj)
}

// Validate Email
const validateEmail=(obj)=>{
    const schema=joi.object({
        email:joi.string().trim().min(5).max(100).email().required(),
    })
    return schema.validate(obj)
}

// Validate new password
const validateNewPassword=(obj)=>{
    const schema=joi.object({
        password:passwordComplexity().required()
    })
    return schema.validate(obj)
}

module.exports={User,validateRegisterUser,validateLoginUser,validateUpdateUser,
    validateEmail,validateNewPassword}