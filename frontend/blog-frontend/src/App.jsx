import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Nav from './components/nav'
import Home from './pages/home'
import Signup from './pages/signup'
import Login from './pages/login'
import Profile from './pages/profile'
import AdminDashboard from './pages/adminDashboard';
import './App.css'
import CreatePost from './post/createPost';
import PreviewPost from './post/previewPost';
import EditPost from './post/editPost';
import Post from './post/post';
import UserPosts from './user/userPosts';
import UserProfile from './user/userProfile';
import UserManagement from './components/userManagement';
import SearchResults from './components/searchResults';
import PostManagement from './components/postManagement';
import ProfileDashboard from './pages/profileDashboard';
import UserPostManagement from './components/userPostManagement';
import UserProfileManagement from './components/userProfileManagement';

function App() {

  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profiledashboard" element={<ProfileDashboard />} />
          <Route path="/profile/post/management" element={<UserPostManagement />} />
          <Route path="/profile/management" element={<UserProfileManagement />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/admin/usermanagement" element={<UserManagement />} />
          <Route path="/admin/postmanagement" element={<PostManagement />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/userposts' element={<UserPosts />} />
          <Route path='/post/:postId' element={<Post />} />
          <Route path='/user/:userId' element={<UserProfile />} />
          <Route path='/previewpost/:postId' element={<PreviewPost />} />
          <Route path='/editPost/:postId' element={<EditPost />} />
          <Route path='/search-results' element={<SearchResults />} />
          
        </Routes>
      </Router>
    </>
  )
}

export default App
