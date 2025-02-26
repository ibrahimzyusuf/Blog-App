import './create-post.css'
import {useState,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { toast} from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { createPost } from '../../redux/apiCalls/postApiCall';
import { RotatingLines } from "react-loader-spinner";
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';

const CreatePost = () => {

  const dispatch=useDispatch()
  const {loading,isPostCreated}=useSelector(state=>state.post)
  const {categories}=useSelector(state=>state.category)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)

  const formSubmitHandler=(event)=>{
    event.preventDefault()

    // Validation
    if (title.trim()==="") return toast.error('Post title is required')
    if (category.trim()==="") return toast.error('Post category is required')
    if (description.trim()==="") return toast.error('Post description is required')
    if (!file) return toast.error('Post image is required')

    /* we use these class because the form that has file or image field cann't be sent as json to the server
    so we use this class to let the form able to sent as json and we make the json data as key and value with 'append'
    the first parameter is the key and it's from backend, the second is the value and it's from frontend */
    const formData=new FormData()
    formData.append('title',title)
    formData.append('category',category)
    formData.append('description',description)
    formData.append('image',file)

    dispatch(createPost(formData))
  }

  const navigate=useNavigate()
  useEffect(()=>{
    if (isPostCreated) {
      navigate('/')
    }
  },[navigate,isPostCreated])

  useEffect(()=>{
    dispatch(fetchCategories())
  },[dispatch])

  return (
    <section className="create-post">
      <h1 className="create-post-title">
        Create New Post
      </h1>
      <form onSubmit={formSubmitHandler} className="create-post-form">
        <input type="text" placeholder='Post Title'
        value={title} onChange={(event)=>setTitle(event.target.value)}
        className="create-post-input" />
        <select 
        value={category} onChange={(event)=>setCategory(event.target.value)}
        className="create-post-input">
          <option disabled value="">
            Select A Category
          </option>
          {categories.map(category=>
            <option key={category._id} value={category.title}>{category.title}</option>)}
        </select>
        <textarea rows={5} placeholder='Post Description'
        value={description} onChange={(event)=>setDescription(event.target.value)}
        className="create-post-textarea" ></textarea>
        <input name='file' type="file" id='file' 
        onChange={(event)=>setFile(event.target.files[0])}
        className="create-post-upload" />
        <button type='submit' className="create-post-btn">
          {loading?(
            <RotatingLines
            visible={true}
            width="40"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"/>
          ):'Create'}
        </button>
      </form>
    </section>
  )
}

export default CreatePost