import { Link } from 'react-router-dom';
import './admin-table.css'
import AdminSidebar from "./AdminSidebar";
import swal from "sweetalert";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from 'react';
import { deletePost, getAllPosts } from '../../redux/apiCalls/postApiCall';


const PostsTable = () => {

    const dispatch=useDispatch()
    const {posts}=useSelector(state=>state.post)

    useEffect(()=>{
        dispatch(getAllPosts())
    },[dispatch])

// Delete post handler
const deletePostHandler=(postId)=>{
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this post!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            dispatch(deletePost(postId))
        }
    });
}

return (
    <section className="table-container">
        <AdminSidebar/>
        <div className="table-wrapper">
            <h1 className="table-title">Posts</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Count</th>
                        <th>User</th>
                        <th>Post Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((item,index)=>
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="table-image">
                                    <img src={item.user.profilePhoto?.url} alt="profile photo" className="table-user-image" loading='lazy' />
                                    <span className='table-username'>{item.user.userName}</span>
                                </div>
                            </td>
                            <td>{item.title}</td>
                            <td>
                                <div className="table-button-group">
                                    <button>
                                        <Link to={`/posts/details/${item._id}`}>View Posts</Link>
                                    </button>
                                    <button onClick={()=>deletePostHandler(item._id)}>Delete Post</button>
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

export default PostsTable