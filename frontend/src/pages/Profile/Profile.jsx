import './profile.css'
import UpdateProfileModal from "./UpdateProfileModal";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { useSelector,useDispatch } from "react-redux";
import { deleteProfile, getUserProfile, uploadProfilePhoto } from '../../redux/apiCalls/profileApiCall';
import { logoutUser } from '../../redux/apiCalls/authApiCall';
import PostItem from '../../components/posts/PostItem';
import { Oval } from "react-loader-spinner";

const Profile = () => {

    const { id }=useParams()
    const dispatch=useDispatch()
    const {profile,loading,isProfileDeleted}=useSelector(state=>state.profile)
    const {user}=useSelector(state=>state.auth)

useEffect(()=>{
    dispatch(getUserProfile(id));
    window.scrollTo(0,0)
},[dispatch,id])

const navigate=useNavigate()
useEffect(()=>{
    if (isProfileDeleted) {
        navigate('/')

    }
},[dispatch,isProfileDeleted,navigate])

const [file,setFile]=useState(null)
const [updateprofile,setUpdateprofile]=useState(false)

// Form submit handler
const formSubmitHandler=(event)=>{
    event.preventDefault()

    // validation
    if(!file) return toast.warning('There is no file')
    
    const formData=new FormData()
    formData.append('image',file)
    dispatch(uploadProfilePhoto(formData))
}

// Delete account handler
const deleteAccountHandler=()=>{
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover your account!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((isOk) => {
        if (isOk) {
            dispatch(deleteProfile(user?._id))
            dispatch(logoutUser())
        }
    });
}

if (loading) {
    return(
        <div className='profile-loader'>
            <Oval
                visible={true}
                height="120"
                width="120"
                color="#000"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                strokeWidth={3}
                strokeWidthSecondary={3}
                secondaryColor='gray'
                />
        </div>
    )
}

return (
    <section className="profile">
        <div className="profile-header">
            <div className="profile-image-wrapper">
                <img src={file? URL.createObjectURL(file):profile?.profilePhoto.url} alt="profile" className="profile-image" loading='lazy' />
                {user?._id===profile?._id && (
                    <form onSubmit={formSubmitHandler}>
                    <abbr title="choose profile photo">
                        <label htmlFor="file" className='bi bi-camera-fill upload-profile-photo-icon'></label>
                    </abbr>
                    <input onChange={(event)=>{setFile(event.target.files[0])}} 
                    style={{display:'none'}} type="file" name='file' id='file' />
                    <button className="upload-profile-photo-btn">Upload</button>
                </form>
                ) }
            </div>
            <h1 className="profile-username">{profile?.userName}</h1>
            <p className="profile-bio">{profile?.bio}</p>
            <div className="user-date-joined">
                <strong>Date Joined</strong>
                <span>{new Date(profile?.createdAt).toDateString()}</span>
            </div>
            {user?._id===profile?._id && (
                <button onClick={()=>setUpdateprofile(true)} className="update-profile-btn">
                <i className="bi bi-file-person-fill"></i>
                Update profile
                </button>
            )}
        </div>
        <div className="profile-posts-list">
            <h1 className='profile-posts-list-title'>{profile?.userName} posts</h1>
            {profile?.posts?.map(post=>
                <PostItem key={post._id}
                post={post}
                userName={profile?.userName}
                userId={profile?._id}/>
            )}
        </div>
        {user?._id===profile?._id &&(
            <button onClick={deleteAccountHandler} className="delete-account-btn">
            Delete your account
            </button>
        )}
        {updateprofile && <UpdateProfileModal profile={profile} setUpdateprofile={setUpdateprofile} />}
    </section>
)
}

export default Profile