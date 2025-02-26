const router=require('express').Router()
const {getAllUsersProfilesCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl}=require('../controllers/usersController')
const {verifyTokenAndAdmin, verifyTokenAndUserHimself, verifyToken, verifyTokenAndAuthorization}=require('../middlewares/verifyToken')
const validateObjectId=require('../middlewares/validateObjectId')
const photoUpload=require('../middlewares/photoUpload')

// /api/users/profiles
router.route('/profiles').get(verifyTokenAndAdmin,getAllUsersProfilesCtrl)

// /api/users/profile/:id
router.route('/profile/:id').get(validateObjectId,getUserProfileCtrl)
    .put(validateObjectId,verifyTokenAndUserHimself,updateUserProfileCtrl)
    .delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfileCtrl)

// /api/users/profile/profile-photo-upload
router.route('/profile/profile-photo-upload').post(verifyToken,photoUpload.single('image'),profilePhotoUploadCtrl)


// /api/users/count
router.route('/count').get(verifyTokenAndAdmin,getUsersCountCtrl)

module.exports=router