import { toast } from "react-toastify";
import { postActions } from "../slices/postSlice";
import axios from "axios";

// Fetch posts pased on page Number
const fetchPosts=(pageNumber)=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.get(`${Process.env.REACT_APP_API_BASE_URL}/api/posts?pageNumber=${pageNumber}`)
            dispatch(postActions.setPosts(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Get posts count
const getPostsCount=()=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.get(`${Process.env.REACT_APP_API_BASE_URL}/api/posts/count`)
            dispatch(postActions.setPostsCount(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Fetch posts pased on category
const fetchPostsByCategory=(category)=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.get(`${Process.env.REACT_APP_API_BASE_URL}/api/posts?category=${category}`)
            dispatch(postActions.setPostsCategory(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Create post
const createPost=(newPost)=>{
    return async (dispatch,getState) => {
        try {
            dispatch(postActions.setLoading())
            await axios.post(`${Process.env.REACT_APP_API_BASE_URL}/api/posts`,newPost,{
                headers:{
                    'Authorization':'Bearer '+getState().auth.user.token,
                    'Content-Type':'multipart/form-data'
                }
            })
            dispatch(postActions.setIsPostCreated())
            setTimeout(()=>dispatch(postActions.clearIsPostCreated()),2000) //2 seconds
        } catch (error) {
            toast.error(error.response.data.message)
            dispatch(postActions.clearLoading())
        }
    }
}

// Fetch single post
const fetchSinglePost=(postId)=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.get(`${Process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}`)
            dispatch(postActions.setPost(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Toggle like
const toggleLike=(postId)=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.put(`${Process.env.REACT_APP_API_BASE_URL}/api/posts//like/${postId}`,{},{
                headers:{
                    'Authorization':'Bearer '+getState().auth.user.token
                }
            })
            dispatch(postActions.setLike(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Update post image
const updatePostImage=(newImage,postId)=>{
    return async (dispatch,getState) => {
        try {
            await axios.put(`${Process.env.REACT_APP_API_BASE_URL}/api/posts/update-image/${postId}`,newImage,{
                headers:{
                    'Authorization':'Bearer '+getState().auth.user.token,
                    'Content-Type':'multipart/form-data'
                }
            })
            toast.success('New post image updated successfully')
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Update post
const updatePost=(newPost,postId)=>{
    return async (dispatch,getState) => {
        try {
            const { data }=await axios.put(`${Process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}`,newPost,{
                headers:{
                    'Authorization':'Bearer '+getState().auth.user.token
                }
            })
            dispatch(postActions.setPost(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Delete post
const deletePost=(postId)=>{
    return async (dispatch,getState) => {
        try {
            const { data }=await axios.delete(`${Process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}`,{
                headers:{
                    'Authorization':'Bearer '+getState().auth.user.token
                }
            })
            dispatch(postActions.deletePost(data.postId))
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Fetch all posts 
const getAllPosts=()=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.get(`${Process.env.REACT_APP_API_BASE_URL}/api/posts`)
            dispatch(postActions.setPosts(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

export {fetchPosts,getPostsCount,fetchPostsByCategory,
    createPost,fetchSinglePost,toggleLike,
    updatePostImage,updatePost,deletePost,
    getAllPosts}