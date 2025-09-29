import { Link, useParams,useNavigate } from "react-router-dom";
import './post-details.css'
import { useEffect,useState } from "react";
import { toast } from "react-toastify";
import AddComment from "../../components/Comments/AddComment";
import CommentList from "../../components/Comments/CommentList";
import swal from "sweetalert";
import UpdatePostModal from "./UpdatePostModal";
import { useDispatch,useSelector } from "react-redux";
import { deletePost, fetchSinglePost,toggleLike, updatePostImage } from "../../redux/apiCalls/postApiCall";

const PostDetails = () => {

    const dispatch=useDispatch()
    const {post}=useSelector(state=>state.post)
    const {user}=useSelector(state=>state.auth)
    const {id}=useParams()

    const [file,setFile]=useState(null)
    const [updatepost,setUpdatepost]=useState(false)

    useEffect(() => {
        window.scrollTo(0,0)
        dispatch(fetchSinglePost(id))
    }, [dispatch,id])
    
    const updateImageSubmitHandler=(event)=>{
        event.preventDefault()
        
        // Validation
        if(!file) return toast.warning('No file provided')

        const formData=new FormData()
        formData.append('image',file)
        dispatch(updatePostImage(formData,post?._id))
    }

    const navigate=useNavigate()

    // Delete post handler
    const deletePostHandler=()=>{
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this post!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((isOk) => {
            if (isOk) {
                dispatch(deletePost(post?._id))
                navigate(`/profile/${user?._id}`)
            }
        });
    }

return (
    <section className="post-details">
        <div className="post-details-image-wrapper">
            <img src={file?URL.createObjectURL(file):post?.image.url} alt="post photo" className="post-details-image" loading="lazy" />
            {user?._id===post?.user?._id && (
                <form onSubmit={updateImageSubmitHandler} className="update-post-image-form">
                <label htmlFor="file" className="update-post-label">
                    <i className="bi bi-image-fill"></i>
                    Select new image
                </label>
                <input style={{display:'none'}} type="file" name="file" id="file" 
                onChange={(event)=>setFile(event.target.files[0])}/>
                <button type="submit">Upload</button>
            </form>
            )}
        </div>
        <h1 className="post-details-title">{post?.title}</h1>
        <div className="post-details-user-info">
            <img src={post?.user?.profilePhoto?.url} alt="profile photo" className="post-details-user-image" loading="lazy" />
            <div className="post-details-user">
                <strong>
                    <Link to={`/profile/${post?.user?._id}`}>{post?.user?.userName}</Link>
                </strong>
                <span>{new Date(post?.createdAt).toDateString()}</span>
            </div>
        </div>
        <p className="post-details-description">
            {post?.description}
        </p>
        <div className="post-details-icon-wrapper">
            <div>
                {user && (
                    <i onClick={()=>dispatch(toggleLike(post?._id))} 
                    className={post?.likes.includes(user?._id)?"bi bi-hand-thumbs-up-fill":"bi bi-hand-thumbs-up"}></i>
                    )}
                <small>{post?.likes.length}likes</small>
            </div>
            {user?._id===post?.user?._id && (
                <div>
                <i onClick={()=>setUpdatepost(true)} className="bi bi-pencil-square"></i>
                <i onClick={deletePostHandler} className="bi bi-trash-fill"></i>
            </div>
            )}
        </div>
        {user ? <AddComment postId={post?._id} />:
        <p className="post-details-info-write">To write a comment you should login first</p>
        }
        
        <CommentList comments={post?.comments} />
        {updatepost&&<UpdatePostModal post={post} setUpdatepost={setUpdatepost} />}
    </section>
)
}

export default PostDetails