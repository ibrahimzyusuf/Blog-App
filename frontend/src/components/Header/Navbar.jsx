import { useSelector } from "react-redux";
import {Link} from 'react-router-dom'

const Navbar = ({toggle,settoggle}) => {

const {user}=useSelector((state)=>state.auth)

return (
    <nav style={{clipPath:toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)"}} className="navbar">
        <ul className="navlinks">
            <Link to='/' onClick={()=>settoggle(false)} className="nav-link">
                <i className="bi bi-house"></i>Home
            </Link>
            <Link to='/posts' onClick={()=>settoggle(false)} className="nav-link">
                <i className="bi bi-stickies"></i>Posts
            </Link>
            {user && (
                <Link to='/posts/create-post' onClick={()=>settoggle(false)} className="nav-link">
                <i className="bi bi-journal-plus"></i>Create
            </Link>
            )}
            {user?.isAdmin && (
                <Link to='/admin-dashboard' onClick={()=>settoggle(false)} className="nav-link">
                <i className="bi bi-person-check"></i>Admin Dashboard
            </Link>
            )}
        </ul>
    </nav>
)
}

export default Navbar