import { passwordActions } from "../slices/passwordSlice";
import axios from "axios";
import { toast } from "react-toastify";

// forgot password
const forgotPassword=(email)=>{
    return async () => {
        try {
            const {data}=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/password/reset-password-link`,{email})
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
        
    }
}

// Get reset password
const getResetPassword=(userId,token)=>{
    return async (dispatch) => {
        try {
            await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/password/reset-password/${userId}/${token}`)
        } catch (error) {
            console.log(error)
            dispatch(passwordActions.setError())
        }
        
    }
}

// Reset password
const resetPassword=(newPassword,user)=>{
    return async () => {
        try {
            const {data}=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/password/reset-password/${user.userId}/${user.token}`,
            {password:newPassword})
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
        
    }
}

export {forgotPassword,getResetPassword,resetPassword}