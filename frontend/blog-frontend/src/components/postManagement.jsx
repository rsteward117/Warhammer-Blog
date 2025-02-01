import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/adminDashboard.css';
import AdminSidebar from '../components/adminSidebar';
import AdminHeader from '../components/adminHeader';
import { BACKEND_URL } from '../config';

const PostManagement = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [postStats, setPostStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
  });

  const [getErrors, setGetErrors] = useState(null);

  useEffect(() => {

    async function getPosts() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/post/allposts`, {headers: {Authorization: `Bearer ${jsonwebtoken}`}})
            setPosts(res.data.getAllPost);
        } catch(err){
            setGetErrors("failed to get all posts")          
        }
    }

    async function getPostStats() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/post/allposts/numbers`, {headers: {Authorization: `Bearer ${jsonwebtoken}`}})
            setPostStats(res.data)
        } catch(err){
            console.err('Error fetching post statistics:', err);
            setGetErrors(err?.response?.data?.message || 'Error fetching post stats');         
        }
    }

    getPosts();
    getPostStats();
  }, [jsonwebtoken]);

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="admin-main-content">
        <AdminHeader />

        <div className="admin-stats-overview">
          <div className="admin-stat-card">
            <h3>Total Posts</h3>
            <p>{postStats.total}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Draft Posts</h3>
            <p>{postStats.draft}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Total Published Posts</h3>
            <p>{postStats.published}</p>
          </div>
        </div>

        {/* If there’s an error, show it */}
        {getErrors && <p style={{ color: 'red' }}>{getErrors}</p>}

        <div className="user-management">
            <h2>All Posts</h2>
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Post Image</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                  <td><img src={post.postImageUrl} width="100px" alt="post's  picture"/></td>
                  <td>{post.title}</td>
                  <td>{post.status}</td>
                  <td>
                    <button onClick={() => handleBanToggle(user.id, user.banned)}>
                      {user.banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default PostManagement;
