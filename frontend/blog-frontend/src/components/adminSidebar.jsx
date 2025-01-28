import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/adminSidebar.css'; 

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <nav className="admin-sidebar">
      <h2 className="admin-title">Admin Panel</h2>
      <ul className="admin-sidebar-menu">
        <li 
          className="admin-sidebar-menu-item"
          onClick={() => navigate('/admindashboard')}
        >
          Admin Dashboard
        </li>
        <li 
          className="admin-sidebar-menu-item"
          onClick={() => navigate('/admin/postmanagement')}
        >
          Manage Posts
        </li>
        <li 
          className="admin-sidebar-menu-item"
          onClick={() => navigate('/admin/usermanagement')}
        >
          Manage Users
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;

