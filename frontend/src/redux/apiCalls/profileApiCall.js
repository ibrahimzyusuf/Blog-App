import { toast } from "react-toastify";
import { profileActions } from "../slices/profileSlice";
import { authActions } from "../slices/authSlice";
import axios from "axios";

// Get user profile
const getUserProfile=(userId)=>{
    return async (dispatch) => {
        try {
            const {data}=await axios.get(`http://localhost:8000/api/users/profile/${userId}`)
            dispatch(profileActions.setProfile(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Uplpoad profile photo
const uploadProfilePhoto=(newPhoto)=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.post(`http://localhost:8000/api/users/profile/profile-photo-upload`,
                newPhoto,{
                    headers:{
                        'Authorization':'Bearer '+ getState().auth.user.token,
                        'Content-Type':'multipart/form-data'
                    }
                }
            )

            dispatch(profileActions.setProfilePhoto(data.profilPhoto))
            dispatch(authActions.setUserPhoto(data.profilPhoto))
            toast.success(data.message)

            const user=JSON.parse(localStorage.getItem('userInfo'))
            user.profilPhoto=data?.profilPhoto
            localStorage.setItem('userInfo',JSON.stringify(user))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Uplpoad profile
const updateProfile=(userId,profile)=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.put(`http://localhost:8000/api/users/profile/${userId}`,
                profile,{
                    headers:{
                        'Authorization':'Bearer '+ getState().auth.user.token,
                    }
                }
            )

            dispatch(profileActions.updateProfile(data))
            dispatch(authActions.setUsername(data.userName))

            const user=JSON.parse(localStorage.getItem('userInfo'))
            user.userName=data?.userName
            localStorage.setItem('userInfo',JSON.stringify(user))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Delete profile
const deleteProfile=(userId)=>{
    return async (dispatch,getState) => {
        try {
            dispatch(profileActions.setLoading())
            const {data}=await axios.delete(`http://localhost:8000/api/users/profile/${userId}`,
                {
                    headers:{
                        'Authorization':'Bearer '+ getState().auth.user.token,
                    }
                }
            )

            dispatch(profileActions.setIsProfileDeleted())
            toast.success(data?.message)
            setTimeout(()=>dispatch(profileActions.clearIsProfileDeleted()),2000)
        } catch (error) {
            toast.error(error.response.data.message)
            dispatch(profileActions.clearLoading())
        }
    }
}

// Get users count (for admin dashboard)
const getUsersCount=()=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.get(`http://localhost:8000/api/users/count`,
                {
                    headers:{
                        'Authorization':'Bearer '+ getState().auth.user.token,
                    }
                }
            )
            dispatch(profileActions.getUsersCount(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

// Get all users profiles (for admin dashboard)
const getAllUsersProfiles=()=>{
    return async (dispatch,getState) => {
        try {
            const {data}=await axios.get(`http://localhost:8000/api/users/profiles`,
                {
                    headers:{
                        'Authorization':'Bearer '+ getState().auth.user.token,
                    }
                }
            )
            dispatch(profileActions.setProfiles(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

export {getUserProfile,uploadProfilePhoto,updateProfile,deleteProfile,getUsersCount,getAllUsersProfiles}