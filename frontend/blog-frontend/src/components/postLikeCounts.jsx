import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';


 
const Likes = ({postId}) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate();

  useEffect(() =>{
    async function getLikes() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/post/${postId}/likes`);
            setLikes(res.data.likeCount)
              
        } catch(err){
            setGetErrors("failed to load posts")          
        }
    }
    getLikes();
}, []);

  return (
    <div>
    {likes && <p>{likes}</p>}
    </div>
  );
};

export default Likes;