const mongoose=require('mongoose')
const joi=require('joi')

const CategorySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        trim:true,
        required:true
    },
},{timestamps:true})

// Category model
const Category=mongoose.model('Category',CategorySchema)

// Validate create Category
const validateCreateCategory=(obj)=>{
    const schema=joi.object({
        title:joi.string().required(),
    })
    return schema.validate(obj)
}


module.exports={Category,validateCreateCategory}