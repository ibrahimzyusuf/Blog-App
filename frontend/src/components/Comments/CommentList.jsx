import { useState } from 'react';
import './comment-list.css'
import swal from "sweetalert";
import UpdateCommentModal from "./UpdateCommentModal";
import Moment from "react-moment";
import {useSelector,useDispatch } from "react-redux";
import { deleteComment } from '../../redux/apiCalls/commentApiCall';

const CommentList = ({comments}) => {

    const dispatch=useDispatch()
    const {user}=useSelector(state=>state.auth)
    const [updatecomment,setUpdatecomment]=useState(false)
    const [commentForUpdate,setCommentForUpdate]=useState(null)

// Delete commentt handler
const deleteCommentHandler=(commentId)=>{
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this comment!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((isOk) => {
            if (isOk) {
            dispatch(deleteComment(commentId))
            }
        });
}

const updateCommentHandler=(comment)=>{
    setCommentForUpdate(comment)
    setUpdatecomment(true)
}

return (
    <div className="comment-list">
        <h4 className="comment-list-count">{comments?.length} Comment</h4>
        {comments?.map(comment=>
        <div key={comment._id} className="comment-item">
            <div className="comment-item-info">
                <div className="comment-item-username">
                    {comment.username}
                </div>
                <div className="comment-item-time">
                    <Moment fromNow ago>
                        {comment.createdAt}
                    </Moment>{" "}ago
                </div>
            </div>
            <p className="comment-item-text">
                {comment.text}
            </p>
            {user?._id===comment.user && (
                <div className="comment-item-icon-wrapper">
                <i onClick={()=>updateCommentHandler(comment)} className="bi bi-pencil-square"></i>
                <i onClick={()=>deleteCommentHandler(comment?._id)} className="bi bi-trash-fill"></i>
            </div>
            )}
        </div>
        )}
        {updatecomment && <UpdateCommentModal commentForUpdate={commentForUpdate} setUpdatecomment={setUpdatecomment} />}
    </div>
)
}

export default CommentList