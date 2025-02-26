import { categoryActions } from "../slices/categorySlice";
import axios from "axios";
import { toast } from "react-toastify";

// Fetch all categories
const fetchCategories=()=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.get('http://localhost:8000/api/categories')
            dispatch(categoryActions.setCategories(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Create category
const createCategory=(newCategory)=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.post('http://localhost:8000/api/categories',newCategory,{
                headers:{
                    Authorization:'Bearer '+getState().auth.user.token
                }
            })
            dispatch(categoryActions.addCategory(data))
            toast.success('Category created successfully')
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Delete category
const deleteCategory=(categoryId)=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.delete(`http://localhost:8000/api/categories/${categoryId}`,{
                headers:{
                    Authorization:'Bearer '+getState().auth.user.token
                }
            })
            dispatch(categoryActions.deleteCategory(data.categoryId))
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

export {fetchCategories,createCategory,deleteCategory}