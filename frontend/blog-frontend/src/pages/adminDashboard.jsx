import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/adminDashboard.css';
import AdminSidebar from '../components/adminSidebar';
import AdminHeader from '../components/adminHeader';
import { BACKEND_URL } from '../config';

//you left off here get the data from the database

const AdminDashboard = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPost, setRecentPost] = useState([]);
  const [getErrors, setGetErrors] = useState();
  const [userStats, setUserStats] = useState(0);
  const [postStats, setPostStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
  });


  const {userId} = useParams();

  useEffect(() =>{
    
    async function getRecentUsers() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/user/recentusers`, {headers: {Authorization: `Bearer ${jsonwebtoken}`}})
            setRecentUsers(res.data.getRecentUsers);
        } catch(err){
            setGetErrors("failed to get users")          
        }
    }

    async function getRecentPosts() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/post/recentposts`, {headers: {Authorization: `Bearer ${jsonwebtoken}`}})
            setRecentPost(res.data.getRecentPosts);
        } catch(err){
            setGetErrors("failed to get users")          
        }
    }

        async function getUsersNumbers() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/user/user/numbers`, {headers: {Authorization: `Bearer ${jsonwebtoken}`}})
            setUserStats(res.data.getUserNumber);
        } catch(err){
            setGetErrors("failed to get users")          
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

    getRecentUsers();
    getRecentPosts();
    getUsersNumbers();
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
            <div className="admin-stat-card">
            <h3>Total Users</h3>
            <p>{userStats}</p>
          </div>
        </div>

        <div className="admin-content-section">
        <div className="user-management">
            <h2>Recent Posts</h2>
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
                {recentPost.map(post => (
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

          <div className="user-management">
            <h2>Recent Users</h2>
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Profile Picture </th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Promote User</th>
                  <th>Posts</th>
                  <th>Activity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id}>
                  <td><img src={user.profilePicUrl} width="100px" alt="user's profile picture"/></td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <select 
                      value={user.role}
                      onChange={(e) => promoteUser(user.id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{user._count?.posts}</td>
                  <td>{user.banned ? 'Banned' : 'Active'}</td>
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
    </div>
  );
};

export default AdminDashboard;
