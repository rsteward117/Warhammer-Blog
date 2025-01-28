import { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
//import { AuthContext } from '../context/AuthContext';
import aquilaimage from '../assets/40k_imperial_aquila__transparent__by_fuguestock_d91enql.png'
import '../styles/signup.css';
import axios from 'axios';

function Signup() {

//   const {user, setUser, jsonwebtoken, setJsonwebtoken, logOut} = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    cPassword: ''
  });

  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      if(res.status === 201){
        //if the post response status code returns "201" then set the serverResponse useState to the response message and have a slight delay to navagate to login.
        setServerResponse(res.data.message)
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (err){
      setGetErrors(err.response.data.message)
      console.log(err)
    }
  }

  const goToLogin = () => {
    navigate(`/login`)
  }

  return (
    <>
      <div className='signup-container'>
      <header className='signup-header'>
          <img 
              src={aquilaimage} 
              alt="Imperium Aquila" 
              className="login-aquila" 
            />
            <h1>Welcome New Inquistor!</h1>
            <h2>Please enter your new credential.</h2>
        </header>
        <form className='signup-form' onSubmit={handleSubmit}>
          {serverResponse && <p>{serverResponse}</p>}
          {getErrors && <p>{getErrors}</p>}
          <label for="username">Username</label>
          <input name="username" className='form-input' placeholder="username" type="text" value={formData.username} onChange={handleChange} />
          <label for="email">Email</label>
          <input name="email" className='form-input' placeholder="email" type="email" value={formData.email} onChange={handleChange} />
          <label for="password">Password</label>
          <input name="password" className='form-input' type="password" value={formData.password} onChange={handleChange} />
          <label for="cPassword">Confirm Password</label>
          <input name="cPassword" className='form-input' type="password" value={formData.cPassword} onChange={handleChange} />
          <button className='signup-form-btn' >Sign Up</button>
          <p className="current-user-text">Already an Inquistor? <span><a className="current-user-btn" onClick={goToLogin}>Login!</a></span></p>
        </form>
      </div>
    </>
  )
}

export default Signup

