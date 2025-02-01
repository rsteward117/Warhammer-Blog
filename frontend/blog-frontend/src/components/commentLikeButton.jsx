import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { BACKEND_URL } from '../config';

 
const CommentLikeButton = ({commentId}) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [likeComment, setLikeComment] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() =>{
    async function fetchPostLikeData() {
        try{
          const likeCounterRes = await axios.get(`${BACKEND_URL}/api/comment/${commentId}/likes`);
          setLikeCount(likeCounterRes.data.likeCount);

        //   const likeStatusRes = await axios.get(`http://localhost:5000/api/comment/${commentId}/isLiked`, {}, {
        //     headers: {
        //       Authorization:  `Bearer ${jsonwebtoken}`,
        //       'Content-Type': 'application/json'
        //     },
        //   });

        // setIsLiked(likeStatusRes.data.likedPost);
              
      } catch(err){
        setGetErrors("failed to load posts")          
      }
    }

    fetchPostLikeData();
  }, [commentId, jsonwebtoken]);



  const handleLike = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post(`${BACKEND_URL}/api/comment/${commentId}/like`, {}, {
        headers: {
            Authorization:  `Bearer ${jsonwebtoken}`,
            'Content-Type': 'application/json'
          },
      });

      setLikeComment(res.data.message);
      setIsLiked(res.data.liked)
    } catch (err){

    }
  }

  return (
    <div>
    {likeComment && <p>{likeComment}</p>}
      <form onSubmit={handleLike}>
        <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {isLiked ? <IoIosHeart color="red" size={24} /> : <IoIosHeartEmpty size={24} />}
          <span>{likeCount}</span>
        </button>

      </form>
    </div>
  );
};

export default CommentLikeButton;