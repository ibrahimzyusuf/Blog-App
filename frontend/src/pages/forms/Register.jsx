import './form.css'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector,useDispatch } from "react-redux";
import { registerUser } from '../../redux/apiCalls/authApiCall';
import swal from "sweetalert";

const Register = () => {

  const{registerMessage}=useSelector(state=>state.auth)
  const dispatch=useDispatch()

const [userName, setUserName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

// Form submit handler
const formSubmitHandler=(event) => { 
  event.preventDefault()

  //Validation
  if(userName.trim()==="") return toast.error('UserName is required')
  if(email.trim()==="") return toast.error('Email is required')
  if(password.trim()==="") return toast.error('Password is required')

  dispatch(registerUser({userName,email,password}))
}

  const navigate=useNavigate()

  if (registerMessage) {
    swal({
      title:registerMessage,
      icon:'success'
    }).then(isOk=>{
      if (isOk) {
        navigate('/login')
      }
    })
  }


return (
  <section className="form-container">
    <h1 className="form-title">Create new acount</h1>
    <form onSubmit={formSubmitHandler} className="form">
      <div className="form-group">
        <label htmlFor="username" className="form-label">UserName</label>
        <input type="text" id='username' placeholder='Enter your username' 
        value={userName} onChange={(event)=>setUserName(event.target.value)} className="form-input" />
      </div>
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
      <button type='submit' className="form-btn">Register</button>
    </form>
    <div className="form-footer">
      Already have an account<Link to={'/login'}>Login</Link>
    </div>
  </section>
)
}

export default Register