import React from 'react'
import './posts.css'
import { Link } from "react-router-dom";

const PostItem = ({post,userName,userId}) => {

  const profileLink=userId ? `/profile/${userId}` : `/profile/${post?.user?._id}`

  return (
    <div className='post-item'>
      <div className="post-item-image-wrapper">
        <img src={post?.image.url} alt="" className='post-item-image'/>
      </div>
      <div className="post-item-info-wrapper">
        <div className="post-item-info">
          <div className="post-item-author">
            <strong>Author: </strong>
            <Link className='post-item-username' to={profileLink}>
            {userName ? userName : post?.user.userName}
            </Link>
          </div>
          <div className="post-item-date">
            {new Date(post?.createdAt).toDateString()}
          </div>
        </div>
        <div className="post-item-details">
          <h4 className="post-item-title">{post?.title}</h4>
          <Link to={`/posts/categories/${post?.category}`} className='post-item-category'>{post?.category}</Link>
        </div>
        <p className="post-item-description">
          {post?.description}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, voluptatum quaerat dicta eius voluptas sit
          eveniet eaque ad amet. Nulla ex delectus quo harum, maxime expedita repellat accusantium provident culpa!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, voluptatum quaerat dicta eius voluptas sit
          eveniet eaque ad amet. Nulla ex delectus quo harum, maxime expedita repellat accusantium provident culpa!
          </p>
          <Link className='post-item-link' to={`/posts/details/${post._id}`}>
          Read more...
          </Link>
      </div>
    </div>
  )
}

export default PostItem