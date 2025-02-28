const asyncHandler=require('express-async-handler')
const bcrypt=require('bcryptjs')
const {User,validateEmail,validateNewPassword}=require('../models/User')
const VerificationToken = require('../models/VerificationToken')
const crypto=require('crypto')
const sendEmail=require('../utils/sendEmail')

/**
 * @desc Send reset password link
 * @route /api/password/reset-password-link
 * @method POST
 * @access Public
 */

const sendResetPasswordLinkCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateEmail(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    // Get the user from db after checking if exist
    const user=await User.findOne({email:req.body.email})
    if (!user) {
        return res.status(404).json({message:'The user with the given email does not exist'})
    }

    // Creating the verification token
    let verificationToken=await VerificationToken.findOne({userId:user._id})
    if (!verificationToken) {
        verificationToken=new VerificationToken({
            userId:user._id,
            token:crypto.randomBytes(32).toString('hex')
        })
        await verificationToken.save()
    }

    // Creating link
    const link=`${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`

    // Creating html template
    const htmlTemplate=`<a href='${link}'>Click here to reset your password</a>`

    // Sending email
    sendEmail(user.email,'Reset the password',htmlTemplate)

    // Response
    res.status(200).json({message:'Reset password link sent to your email, please check your inbox'})
})

/**
 * @desc Get reset password link
 * @route /api/password/reset-password/:userId/:token
 * @method GET
 * @access Public
 */

const getResetPasswordLinkCtrl=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.userId)
    if (!user) {
        return res.status(400).json({message:'Invalid link'})
    }
    const verificationToken=await VerificationToken.findOne({
        userId:user._id,
        token:req.params.token
    })
    if (!verificationToken) {
        return res.status(400).json({message:'Invalid link'})
    }

    res.status(200).json({message:'Valid url'})
})

/**
 * @desc Reset password
 * @route /api/password/reset-password/:userId/:token
 * @method POST
 * @access Public
 */

const resetPasswordCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateNewPassword(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    const user=await User.findById(req.params.userId)
    if (!user) {
        return res.status(400).json({message:'Invalid link'})
    }
    const verificationToken=await VerificationToken.findOne({
        userId:user._id,
        token:req.params.token
    })
    if (!verificationToken) {
        return res.status(400).json({message:'Invalid link'})
    }

    if (!user.isAccountVerified) {
        user.isAccountVerified=true
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)

    user.password=hashedPassword
    await user.save()
    await verificationToken.deleteOne()

    res.status(200).json({message:'Password reset successfully, please login'})
})

module.exports={sendResetPasswordLinkCtrl,getResetPasswordLinkCtrl,resetPasswordCtrl}