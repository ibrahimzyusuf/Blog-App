import './form.css'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getResetPassword, resetPassword } from '../../redux/apiCalls/passwordApiCall';

const ResetPassword = () => {

    const dispatch=useDispatch()
    const {isError}=useSelector(state=>state.password)
    const [password, setPassword] = useState("")
    const {userId,token}=useParams()

    useEffect(()=>{
        dispatch(getResetPassword(userId,token))
    },[dispatch,userId,token])

// Form submit handler
const formSubmitHandler=(event) => { 
    event.preventDefault()

  //Validation
    if(password.trim()==="") return toast.error('Password is required')

    dispatch(resetPassword(password,{userId,token}))
}

return (
    <section className="form-container">
        {isError ? (<h1>Not Found</h1>):
        (
            <>
                <h1 className="form-title">Reset Password</h1>
                <form onSubmit={formSubmitHandler} className="form">
                    <div className="form-group">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input type="password" id='password' placeholder='Enter your password' 
                    value={password} onChange={(event)=>setPassword(event.target.value)} className="form-input" />
                    </div>
                    <button type='submit' className="form-btn">Submit</button>
                </form>
            </>
        )}
        
    </section>
)
}

export default ResetPassword