import { authActions } from "../slices/authSlice";
import axios from "axios";
import { toast } from "react-toastify";

const loginUser=(user)=> {
    return async (dispatch) => {
        try {
            /* const response=await fetch('http://localhost:8000/api/auth/login',{
                method:'POST',
                body:JSON.stringify(user),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            const data=await response.json() */
            // <=>
            const {data}=await axios.post(`${Process.env.REACT_APP_API_BASE_URL}/api/auth/login`,user)

            dispatch(authActions.login(data))
            localStorage.setItem('userInfo',JSON.stringify(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Logout user
const logoutUser=()=>{
    return (dispatch) => { 
        dispatch(authActions.logout())
        localStorage.removeItem('userInfo')
    }
}

// Register user
const registerUser=(user)=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.post(`${Process.env.REACT_APP_API_BASE_URL}/api/auth/register`,user)
            dispatch(authActions.register(data.message))
        } catch (error) {
            toast.error(error.response.data.message)
        }
        
    }
}

// Verify email
const verifyEmail=(userId,token)=>{
    return async (dispatch) => {
        try {
            await axios.get(`${Process.env.REACT_APP_API_BASE_URL}/api/auth/${userId}/verify/${token}`)
            dispatch(authActions.setIsEmailVerified())
        } catch (error) {
            console.log(error)
        }
        
    }
}

export {loginUser,logoutUser,registerUser,verifyEmail}