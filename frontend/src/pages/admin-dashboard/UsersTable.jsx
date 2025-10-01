import { Link } from 'react-router-dom';
import './admin-table.css'
import AdminSidebar from "./AdminSidebar";
import swal from "sweetalert";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from 'react';
import { deleteProfile, getAllUsersProfiles } from '../../redux/apiCalls/profileApiCall';


const UsersTable = () => {

    const dispatch=useDispatch()
    const {profiles,isProfileDeleted}=useSelector(state=>state.profile)

    useEffect(()=>{
        dispatch(getAllUsersProfiles())
    },[dispatch,isProfileDeleted])

// Delete user handler
const deleteUserHandler=(userId)=>{
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            dispatch(deleteProfile(userId))
        }
    });
}

return (
    <section className="table-container">
        <AdminSidebar/>
        <div className="table-wrapper">
            <h1 className="table-title">Users</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Count</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((item,index)=>
                        <tr key={item._id}>
                            <td>{index +1}</td>
                            <td>
                                <div className="table-image">
                                    <img src={item.profilePhoto?.url} alt="profile" className="table-user-image" loading='lazy' />
                                    <span className='table-username'>{item.userName}</span>
                                </div>
                            </td>
                            <td>{item.email}</td>
                            <td>
                                <div className="table-button-group">
                                    <button>
                                        <Link to={`/profile/${item._id}`}>View Profile</Link>
                                    </button>
                                    <button onClick={()=>deleteUserHandler(item._id)}>Delete User</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </section>
)
}

export default UsersTable