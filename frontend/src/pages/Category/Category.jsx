import { useParams,Link } from 'react-router-dom'
import './category.css'
import PostList from "../../components/posts/PostList";
import { useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { fetchPostsByCategory } from '../../redux/apiCalls/postApiCall';

const Category = () => {

    const dispatch=useDispatch()
    const {postsCategory}=useSelector(state=>state.post)

    const {category}=useParams()


useEffect(()=>{
    dispatch(fetchPostsByCategory(category))
    window.scrollTo(0,0)},
    [dispatch,category])

return (
    <section className="Category">
        {postsCategory.length===0?
        <>
            <h1 className="category-not-found">Category with <span>{category}</span> category not found</h1>
            <Link className='category-not-found-link' to={'/posts'}>Go to posts page</Link>
        </>:
        <>
            <h1 className="category-title">Posts based on {category}</h1>
            <PostList posts={postsCategory}/>
        </>
        }
    </section>
)
}

export default Category