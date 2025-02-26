import './update-comment.css'
import { useState } from "react";
import {toast} from "react-toastify";
import { useDispatch } from "react-redux";
import { updateComment } from '../../redux/apiCalls/commentApiCall';

const UpdateCommentModal = ({setUpdatecomment,commentForUpdate}) => {

    const dispatch=useDispatch()
    const [text,setText]=useState(commentForUpdate?.text)

// Form submit handler
const formSubmitHandler=(event)=>{
    event.preventDefault()

    // Validation
    if(text.trim()==="") return toast.error('Please write something')

    dispatch(updateComment(commentForUpdate?._id,{text}))
    setUpdatecomment(false)
}

return (
    <div className="update-comment">
        <form onSubmit={formSubmitHandler}  className="update-comment-form">
            <abbr title="close">
                <i onClick={()=>setUpdatecomment(false)} className="bi bi-x-circle-fill update-comment-form-close"></i>
            </abbr>
            <h1 className="update-comment-title">Update Comment</h1>
            <input value={text} onChange={(event)=>setText(event.target.value)}
            type="text" className="update-comment-input" />
            <button type='submit' className="update-comment-btn">Edit Comment</button>
        </form>
    </div>
)
}

export default UpdateCommentModal