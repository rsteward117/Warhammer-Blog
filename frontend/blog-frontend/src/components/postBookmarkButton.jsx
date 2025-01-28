import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

 
const BookmarkButton = ({postId}) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [bookmarkPost, setBookmarkPost] = useState();
  const [isBookmarked, setIsBookmarked] = useState(false);



  const handleBookmark = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post(`http://localhost:5000/api/post/${postId}/bookmark`, {}, {
        headers: {
            Authorization:  `Bearer ${jsonwebtoken}`,
            'Content-Type': 'application/json'
          },
      });

      setBookmarkPost(res.data.message);
      setIsBookmarked(res.data.marked)

    } catch (err){

    }
  }

  return (
    <div>
      <form onSubmit={handleBookmark}>
        <button onClick={handleBookmark} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {isBookmarked ? <FaBookmark color="yellow" size={30} /> : <FaRegBookmark color='white' size={30} />}
          {bookmarkPost && <p style={{color: 'white'}}>{bookmarkPost}</p>}
        </button>

      </form>
    </div>
  );
};

export default BookmarkButton;