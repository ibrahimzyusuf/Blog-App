import { useDispatch } from 'react-redux';
import './update-profile.css'
import { useState } from "react";
import { updateProfile } from '../../redux/apiCalls/profileApiCall';


const UpdateProfileModal = ({setUpdateprofile,profile}) => {

    const dispatch=useDispatch()

const [userName,setUserName]=useState(profile.userName)
const [bio,setBio]=useState(profile.bio)
const [password,setPassword]=useState("")

// Form submit handler
const formSubmitHandler=(event)=>{
    event.preventDefault()

    const updatedUser={userName,bio}

    if (password.trim()!=="") {
        updatedUser.password=password
    }
    
    dispatch(updateProfile(profile._id,updatedUser))
    setUpdateprofile(false)
}

return (
    <div className="update-profile">
        <form onSubmit={formSubmitHandler}  className="update-profile-form">
            <abbr title="close">
                <i onClick={()=>setUpdateprofile(false)} className="bi bi-x-circle-fill update-profile-form-close"></i>
            </abbr>
            <h1 className="update-profile-title">Update profile</h1>
            <input value={userName} onChange={(event)=>setUserName(event.target.value)}
            type="text" className="update-profile-input" placeholder='UserName' />
            <input value={bio} onChange={(event)=>setBio(event.target.value)}
            type="text" className="update-profile-input" placeholder='Bio' />
            <input value={password} onChange={(event)=>setPassword(event.target.value)}
            type="text" className="update-profile-input" placeholder='Password' />
            
            <button type='submit' className="update-profile-btn">Update Profile</button>
        </form>
    </div>
)
}

export default UpdateProfileModal