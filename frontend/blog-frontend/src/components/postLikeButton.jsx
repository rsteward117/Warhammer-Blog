import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { BACKEND_URL } from '../config';

 
const LikeButton = ({postId}) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [likePost, setLikePost] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCounts] = useState();

  useEffect(() =>{
    async function fetchPostLikeData() {
        try{
          const likeCounterRes = await axios.get(`${BACKEND_URL}/api/post/${postId}/likes`);
            setLikeCounts(likeCounterRes.data.likeCount)

          // const likeStatusRes = await axios.get(`http://localhost:5000/api/post/${postId}/isLiked`, {}, {
          //   headers: {
          //     Authorization:  `Bearer ${jsonwebtoken}`,
          //     'Content-Type': 'application/json'
          //   },
          // });

        // setIsLiked(likeStatusRes.data.likedPost);
              
      } catch(err){
        // setGetErrors("failed to load posts")          
      }
    }

    fetchPostLikeData();
  }, [postId, jsonwebtoken]);



  const handleLike = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post(`${BACKEND_URL}/api/post/${postId}/like`, {}, {
        headers: {
            Authorization:  `Bearer ${jsonwebtoken}`,
            'Content-Type': 'application/json'
          },
      });

      setLikePost(res.data.message);
      setIsLiked(res.data.liked)

      // setLikeCounts((prev) => (res.data.liked ? prev + 1 : prev - 1));
    } catch (err){

    }
  }

  return (
    <div>
      <form onSubmit={handleLike}>
        <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {isLiked ? <IoIosHeart color="red" size={30} /> : <IoIosHeartEmpty color='white' size={30} />}
          <span>{likeCount}</span>
          {likePost && <p style={{color: 'white'}}>{likePost}</p>}
        </button>

      </form>
    </div>
  );
};

export default LikeButton;