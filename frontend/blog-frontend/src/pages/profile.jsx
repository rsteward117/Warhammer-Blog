import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';

const Profile = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);

  const [formData, setFormData] = useState({ bio: '', username: ''});
  const [profilePic, setProfilePic] = useState(null)
  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profilepic", profilePic)

    try{
      const res = await axios.post("http://localhost:5000/api/user/profilepic", formData,{
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:  `Bearer ${jsonwebtoken}`,
        },
      });

      if(res.status === 200){
        setServerResponse(res.data.message)
        setTimeout(() => location.reload(), 1000);
      }

    } catch(err){
      setGetErrors(err.response.data.message)
      console.log(err)
    }
  }

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/user/username', 
        {username: formData.username},
      {
        headers: {
          Authorization: `Bearer ${jsonwebtoken}`,
        }
      }
    );
      if(res.status === 200){
        setServerResponse(res.data.message)
        setTimeout(() => location.reload(), 1000);
      }
    } catch (err){
        setGetErrors(err.response.data.message)
      console.log(err)
    }
  }

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/user/bio', 
        {bio: formData.bio},
      {
        headers: {
          Authorization: `Bearer ${jsonwebtoken}`,
        }
      }
    );
      if(res.status === 200){
        setServerResponse(res.data.message)
        setTimeout(() => location.reload(), 1000);
      }
    } catch (err){
        setGetErrors(err.response.data.message)
      console.log(err)
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{user.username}'s Profile</h2>
      <form onSubmit={handleUsernameSubmit}>
        {getErrors && <p>{getErrors}</p>}
        {serverResponse && <p>{serverResponse}</p>}
        <label for="username">Update Username</label>
        <input name="username" type="text" value={formData.username} onChange={handleChange} />
        <button type='submit'>Update Username</button>
      </form>

      <h2>{user.email}</h2>
      <img
        src={user.profilePicUrl}
        alt="Profile"
        style={{ width: '150px', height: '150px', borderRadius: '50%' }}
      />

      <form onSubmit={handleProfilePicSubmit}>
        <label for="profilepic">Profile Picture</label>
        <input type='file' name='profilepic' accept='image/*' onChange={handleProfilePicChange} />
        <button type='submit'>Update Profile Picture</button>
      </form>


      <p>{user.bio}</p>
        <form onSubmit={handleBioSubmit}>
        {getErrors && <p>{getErrors}</p>}
        {serverResponse && <p>{serverResponse}</p>}
        <label for="bio">{user.bio ? "Update Bio" : "Add a Bio"}</label>
        <input name="bio" type="text" value={formData.bio} onChange={handleChange} />
        <button type='submit'>{user.bio ? "Update Bio" : "Create Bio"}</button>
      </form>
    </div>
  );
};

export default Profile;