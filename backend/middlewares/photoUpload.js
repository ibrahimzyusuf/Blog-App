const path=require('path')
const multer=require('multer')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage(); // Store the file in memory

const photoUpload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb({ message: 'Unsupported format' }, false);
        }
    },
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    });

module.exports=photoUpload