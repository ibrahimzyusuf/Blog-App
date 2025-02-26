const asyncHandler=require('express-async-handler')
const {Category,validateCreateCategory}=require('../models/Category')


/**
 * @desc Create new category
 * @route /api/categories
 * @method POST
 * @access private(Only admin)
 */

const createCategoryCtrl=asyncHandler(async(req,res)=>{
    // Validation
    const {error}=validateCreateCategory(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    }

    const category=await Category.create({
        title:req.body.title,
        user:req.user.id
    })

    // Response
    res.status(201).json(category)
})

/**
 * @desc Get all categories
 * @route /api/categories
 * @method GET
 * @access public
 */

const getAllCategoriesCtrl=asyncHandler(async(req,res)=>{
    const categories=await Category.find()
    res.status(200).json(categories)
})

/**
 * @desc Delete Category
 * @route /api/categories/:id
 * @method DELETE
 * @access private(Only admin)
 */

const deleteCategoryCtrl=asyncHandler(async(req,res)=>{
    // Check if the category exist
    const category=await Category.findById(req.params.id)
    if (!category) {
        return res.status(404).json({message:'Category not found'})
    }

    await Category.findByIdAndDelete(req.params.id)
    res.status(200).json({message:'Category has been deleted successfully',
        categoryId:category._id
    })
})

module.exports={createCategoryCtrl,getAllCategoriesCtrl,deleteCategoryCtrl}