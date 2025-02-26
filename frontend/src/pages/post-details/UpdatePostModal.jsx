import './update-post.css'
import { useState,useEffect } from "react";
import {toast} from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { fetchSinglePost, updatePost } from '../../redux/apiCalls/postApiCall';
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';

const UpdatePostModal = ({setUpdatepost,post}) => {

    const dispatch=useDispatch()
    const {categories}=useSelector(state=>state.category)

    const [title,setTitle]=useState(post.title)
    const [category,setCategory]=useState(post.category)
    const [description,setDescription]=useState(post.description)

// Form submit handler
const formSubmitHandler=(event)=>{
    event.preventDefault()

    // Validation
    if(title.trim()==="") return toast.error('Post title is required')
    if(category.trim()==="") return toast.error('Pos category is required')
    if(description.trim()==="") return toast.error('Post description is required')
    
    dispatch(updatePost({title,category,description},post?._id)).then(()=>{
        dispatch(fetchSinglePost(post?._id))})
    setUpdatepost(false)
}

useEffect(()=>{
    dispatch(fetchCategories())
    },[dispatch])

return (
    <div className="update-post">
        <form onSubmit={formSubmitHandler}  className="update-post-form">
            <abbr title="close">
                <i onClick={()=>setUpdatepost(false)} className="bi bi-x-circle-fill update-post-form-close"></i>
            </abbr>
            <h1 className="update-post-title">Update Post</h1>
            <input value={title} onChange={(event)=>setTitle(event.target.value)}
            type="text" className="update-post-input" />
            <select className='update-post-input' value={category} onChange={(event)=>setCategory(event.target.value)}>
                <option disabled >
                    Select A Category
                </option>
                {categories.map(category=>
                <option key={category._id} value={category.title}>{category.title}</option>)}
            </select>
            <textarea value={description} onChange={(event)=>setDescription(event.target.value)}
            rows={5} className="update-post-textarea"></textarea>
            <button type='submit' className="update-post-btn">Update Post</button>
        </form>
    </div>
)
}

export default UpdatePostModal