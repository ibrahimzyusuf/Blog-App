import './admin.css'
import { toast} from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from '../../redux/apiCalls/categoryApiCall';

const AddCategoryForm = () => {

    const dispatch=useDispatch()
    const [title, setTitle] = useState("")

// Form submit handler
const formSubmitHandler=(event)=>{
    event.preventDefault()

    if(title.trim()==="") return toast.error('Category title is required')

    dispatch(createCategory({title}))
    setTitle('')
}

return (
    <div className="add-category">
        <h6 className="add-category-title">Add New Category</h6>
        <form onSubmit={formSubmitHandler}>
            <div className="add-category-form-group">
                <label htmlFor="title">Category Title</label>
                <input type="text" id="title" placeholder="Enter category title" 
                value={title} onChange={(event)=>setTitle(event.target.value)}/>
            </div>
            <button type="submit" className="add-category-btn">Add</button>
        </form>
    </div>
)
}

export default AddCategoryForm