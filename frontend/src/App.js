import {BrowserRouter,Route,Routes,Navigate} from 'react-router-dom'
import Header from "./components/Header/Header";
import Home from './pages/home/Home.jsx'
import Login from './pages/forms/Login.jsx'
import Register from './pages/forms/Register.jsx'
import PostsPage from './pages/posts-page/PostsPage.jsx'
import CreatePost from './pages/create-post/CreatePost.jsx'
import AdminDashboard from './pages/admin-dashboard/AdminDashboard.jsx'
import Footer from './components/footer/Footer.jsx';
import PostDetails from './pages/post-details/PostDetails.jsx';
import { ToastContainer } from "react-toastify";
import Category from './pages/Category/Category.jsx';
import Profile from './pages/Profile/Profile.jsx';
import UsersTable from './pages/admin-dashboard/UsersTable.jsx';
import PostsTable from './pages/admin-dashboard/PostsTable.jsx';
import CategoriesTable from './pages/admin-dashboard/CategoriesTable.jsx';
import CommentsTable from './pages/admin-dashboard/CommentsTable.jsx';
import ForgotPassword from './pages/forms/ForgotPassword.jsx';
import ResetPassword from './pages/forms/ResetPassword.jsx';
import NotFound from './pages/not-found/NotFound.jsx';
import { useSelector } from "react-redux";
import VerifyEmail from './pages/verify-email/VerifyEmail.jsx';

function App() {

const {user}=useSelector(state=>state.auth)

  return (
    <BrowserRouter>
    <ToastContainer theme="colored" position="top-center"/>
      <Header/>
      <Routes>
        <Route path='/' 
          element={<Home/>}/>

        <Route path='/login' 
          element={!user?<Login/>:<Navigate to={'/'} />}/>

        <Route path='/register' 
          element={!user?<Register/>:<Navigate to={'/'} />}/>

        <Route path='/users/:userId/verify/:token' 
          element={!user?<VerifyEmail/>:<Navigate to={'/'} />}/>

        <Route path='/forgot-password' 
          element={<ForgotPassword/>}/>

        <Route path='/reset-password/:userId/:token' 
          element={<ResetPassword/>}/>

        <Route path='/profile/:id' 
          element={<Profile/>}/>

        <Route path='/posts' 
          element={<PostsPage/>}/>

        <Route path='/posts/create-post' 
          element={user?<CreatePost/>:<Navigate to={'/'} />}/>

        <Route path='/posts/details/:id' 
          element={<PostDetails/>}/>

        <Route path='/posts/categories/:category' 
          element={<Category/>}/>

        <Route path='/admin-dashboard' 
          element={user?.isAdmin?<AdminDashboard/>:<Navigate to={'/'} />}/>

        <Route path='/admin-dashboard/users-table' 
          element={user?.isAdmin?<UsersTable/>:<Navigate to={'/'} />}/>

        <Route path='/admin-dashboard/posts-table' 
          element={user?.isAdmin?<PostsTable/>:<Navigate to={'/'} />}/>

        <Route path='/admin-dashboard/categories-table' 
          element={user?.isAdmin?<CategoriesTable/>:<Navigate to={'/'} />}/>

        <Route path='/admin-dashboard/comments-table' 
          element={user?.isAdmin?<CommentsTable/>:<Navigate to={'/'} />}/>

        <Route path='*' 
          element={<NotFound/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
