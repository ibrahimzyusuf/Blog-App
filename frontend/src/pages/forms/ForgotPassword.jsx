import './form.css'
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { forgotPassword } from '../../redux/apiCalls/passwordApiCall';

const ForgotPassword = () => {

    const dispatch=useDispatch()
    const [email, setEmail] = useState("")

// Form submit handler
const formSubmitHandler=(event) => { 
    event.preventDefault()

    //Validation
    if(email.trim()==="") return toast.error('Email is required')
    dispatch(forgotPassword(email))
}

return (
    <section className="form-container">
    <h1 className="form-title">Forgot Password </h1>
    <form onSubmit={formSubmitHandler} className="form">
        <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" id='email' placeholder='Enter your email' 
        value={email} onChange={(event)=>setEmail(event.target.value)} className="form-input" />
        </div>
        <button type='submit' className="form-btn">Submit</button>
    </form>
    </section>
)
}

export default ForgotPassword