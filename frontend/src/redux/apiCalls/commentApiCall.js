import { postActions } from "../slices/postSlice";
import { commentActions } from "../slices/commentSlice";
import axios from "axios";
import { toast } from "react-toastify";

// Create comment
const createComment=(newComment)=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.post(`${Process.env.REACT_APP_API_BASE_URL}/api/comments`,newComment,{
                headers:{
                    Authorization:'Bearer '+getState().auth.user.token
                }
            })
            dispatch(postActions.addCommentToPost(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Update comment
const updateComment=(commentId,comment)=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.put(`${Process.env.REACT_APP_API_BASE_URL}/api/comments/${commentId}`,comment,{
                headers:{
                    Authorization:'Bearer '+getState().auth.user.token
                }
            })
            dispatch(postActions.updateCommentPost(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Delete comment
const deleteComment=(commentId)=>{
    return async (dispatch,getState) => {
        try {
            await axios.delete(`${Process.env.REACT_APP_API_BASE_URL}/api/comments/${commentId}`,{
                headers:{
                    Authorization:'Bearer '+getState().auth.user.token
                }
            })
            dispatch(commentActions.deleteComment(commentId))
            dispatch(postActions.deleteCommentPost(commentId))
        } catch (error) {
            toast.error(error.response.message)
        }
    }
}

// Fetch all comments
const fetchAllComments=()=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.get(`${Process.env.REACT_APP_API_BASE_URL}/api/comments`,{
                headers:{
                    Authorization:'Bearer '+getState().auth.user.token
                }
            })
            dispatch(commentActions.setComments(data))
        } catch (error) {
            toast.error(error.response.message)
        }
    }
}

export {createComment,updateComment,deleteComment,fetchAllComments}