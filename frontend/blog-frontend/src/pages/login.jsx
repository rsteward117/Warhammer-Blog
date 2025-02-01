import { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../authContext';
import '../styles/login.css';
import aquilaimage from '../assets/40k_imperial_aquila__transparent__by_fuguestock_d91enql.png'
import LoadingSpinner from '../components/loadingspinner';
import { BACKEND_URL } from '../config';

function Login() {

  const {user, setUser, jsonwebtoken, setJsonwebtoken, logOut} = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();
  const [message, setMessage] = useState('');

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, formData);
      //this gets the token from the response data from express and set it to localStorage
      localStorage.setItem('token', res.data.token);
      //this set the json web token from express rest api in the useState for AuthContext to use
      setJsonwebtoken(res.data.token);
      //this sets the user data from the express rest api in the useState fro AuthContext to use
      setUser(res.data.user);

      setMessage('you have successfully login');
      setTimeout(() =>{
        navigate('/')
      }, 1000)
    } catch (err){
      setGetErrors(err.response.data.message);
      console.log(err)
      setMessage('login was unsuccessfully')
    }
  }

  const goToRegister = () => {
    navigate(`/signup`)
  }

  return (
    <>
        {user?(
          <h1>Welcome Inquistor {user.username}! <LoadingSpinner /></h1>
        ): (
        <div className='login-container'>

          <header className='login-header'>
          <img 
              src={aquilaimage} 
              alt="Imperium Aquila" 
              className="login-aquila" 
            />
            <h1>Welcome Back Inquistor!</h1>
            <h2>Please enter your credential.</h2>
          </header>
          <form className='login-form' onSubmit={handleSubmit}>
          {message && <p>{message}</p>}
          {getErrors && <p>{getErrors}</p>}
          <label for="usernameOrEmail">Username/Email</label>
          <input className='form-input' name="usernameOrEmail" placeholder="please enter either your username or email" type="text" value={formData.usernameOrEmail} onChange={handleChange} />
          <label for="password">Password</label>
          <input className='form-input' name="password" type="password" value={formData.password} onChange={handleChange} />
          <button className='login-form-btn' >login</button>
          <p className="new-user-text">A New Inquistor? <span><a className="new-user-btn" onClick={goToRegister}>Register!</a></span></p>
        </form>
      </div>
      )}
    </>
  )
}

export default Login

