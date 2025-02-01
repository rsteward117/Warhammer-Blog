import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/adminDashboard.css';
import AdminSidebar from '../components/adminSidebar';
import AdminHeader from '../components/adminHeader';
import { BACKEND_URL } from '../config';

const UserManagement = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(0);

  const {userId} = useParams();

  useEffect(() =>{
    async function getUsers() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/user/allUsers`, {headers: {Authorization: `Bearer ${jsonwebtoken}`}})
            setUsers(res.data.getAllUsers);
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
    getUsers();
    getUsersNumbers();
}, [jsonwebtoken]);

const promoteUser = async (userId, newRole) => {
    try{
        const res = await axios.put(`${BACKEND_URL}/api/user/${userId}/promote`, {role: newRole}, {headers: {Authorization: `Bearer ${jsonwebtoken}`}})
        window.location.reload();
    }catch(err){
        setGetErrors(err.response.data.message)
    }
}


  return (
    <>
      <div className="admin-dashboard-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="admin-main-content">
        <AdminHeader />
      <div className="admin-stats-overview">
        <div className="admin-stat-card">
          <h3>Total Users</h3>
          <p>{userStats}</p>
        </div>
      </div>

      <div className="user-management">
            <h2>User Management</h2>
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
                {users.map(user => (
                  <tr key={user.id}>
                  <td><img src={user.profilePicUrl || `${BACKEND_URL}/static/blank-profile-picture-973460.svg` } width="100px" alt="user's profile picture"/></td>
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
    </>

  );
};

export default UserManagement;