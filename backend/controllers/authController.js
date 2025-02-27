const asyncHandler=require('express-async-handler')
const bcrypt=require('bcryptjs')
const {User,validateRegisterUser,validateLoginUser}=require('../models/User')
const VerificationToken = require('../models/VerificationToken')
const crypto=require('crypto')
const sendEmail=require('../utils/sendEmail')

/**
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @access Public
 */

const registerUserCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateRegisterUser(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    // Check if the user already exist
    let user=await User.findOne({email:req.body.email})
    if (user) {
        return res.status(400).json({message:'User already exist'})
    }
    
    // Hashing the password
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)

    // Create the user and save it
    user=new User({
        userName:req.body.userName,
        email:req.body.email,
        password:hashedPassword
    })
    await user.save()

    // Creating new verifucation token
    const verificationToken=new VerificationToken({
        userId:user._id,
        token:crypto.randomBytes(32).toString('hex')
    })
    await verificationToken.save()

    // Making the link
    const link=`${process.env.FRONTEND_URL}/users/${user._id}/verify/${verificationToken.token}`

    // Putting the link in html template
    const htmlTemplate=`
    <div>
    <p>Click the link below to verify your email</p>
    <a href='${link}'>Verify</a>
    </div>
    `

    // Sending the email to the user
    await sendEmail(user.email,'Verify your email',htmlTemplate)

    // Response
    res.status(201).json({message:'We sent you an email, please verify your email address'})
})


/**
 * @desc Login user
 * @route /api/auth/login
 * @method POST
 * @access Public
 */

const loginUserCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateLoginUser(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    // Check if the user is registered
    let user=await User.findOne({email:req.body.email})
    if (!user) {
        return res.status(400).json({message:'Invalid email or password'})
    }

    // Check if the password correct
    const isPasswordMatch=await bcrypt.compare(req.body.password,user.password)
    if (!isPasswordMatch) {
        return res.status(400).json({message:'Invalid email or password'})
    }

    // @TODO sending email(verify account)
    if (!user.isAccountVerified) {
        let verificationToken=await VerificationToken.findOne({userId:user._id})

        if (!verificationToken) {
            verificationToken=new VerificationToken({
                userId:user._id,
                token:crypto.randomBytes(32).toString('hex')
            })
            await verificationToken.save()
        }

        // Making the link
        const link=`${process.env.FRONTEND_URL}/users/${user._id}/verify/${verificationToken.token}`

        // Putting the link in html template
        const htmlTemplate=`
        <div>
        <p>Click the link below to verify your email</p>
        <a href='${link}'>Verify</a>
        </div>
    `

        // Sending the email to the user
        await sendEmail(user.email,'Verify your email',htmlTemplate)

        return res.status(400).json({message:'We sent you an email, please verify your email address'})
    }

    // Generate token
    const token=user.generateAuthToken()

    // Response
    res.status(200).json({
        _id:user._id,
        isAdmin:user.isAdmin,
        profilePhoto:user.profilePhoto,
        token,
        userName:user.userName
    })
})


/**
 * @desc Verify user account
 * @route /api/auth/:userId/verify/:token
 * @method GET
 * @access Public
 */

const verifyUserAccountCtrl=asyncHandler(async(req,res)=>{
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

    user.isAccountVerified=true
    await user.save()

    await verificationToken.deleteOne()

    res.status(200).json({message:'Your account verified'})
})

module.exports={registerUserCtrl,loginUserCtrl,verifyUserAccountCtrl}