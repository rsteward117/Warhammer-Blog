import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import {Puff} from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom';
import '../styles/loadingSpinner.css';

 
const LoadingSpinner = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='loading-header'>
      <p className="loading-message">
        Loading...
      </p>
      <Puff color='#FFD700'/>
    </div>
  );
};

export default LoadingSpinner;