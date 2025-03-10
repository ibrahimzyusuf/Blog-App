import './form.css'
import { Link } from 'react-router-dom'
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from '../../redux/apiCalls/authApiCall';

const Login = () => {

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

const dispatch=useDispatch()

// Form submit handler
const formSubmitHandler=(event) => { 
  event.preventDefault()

  //Validation
  if(email.trim()==="") return toast.error('Email is required')
  if(password.trim()==="") return toast.error('Password is required')

  dispatch(loginUser({email,password}))
}

return (
  <section className="form-container">
    <h1 className="form-title">Login into your acount</h1>
    <form onSubmit={formSubmitHandler} className="form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" id='email' placeholder='Enter your email' 
        value={email} onChange={(event)=>setEmail(event.target.value)} className="form-input" />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" id='password' placeholder='Enter your password' 
        value={password} onChange={(event)=>setPassword(event.target.value)} className="form-input" />
      </div>
      <button type='submit' className="form-btn">Login</button>
    </form>
    <div className="form-footer">
      Did you forgot your password?<Link to={'/forgot-password'}>Forgot Password</Link>
    </div>
  </section>
)
}

export default Login