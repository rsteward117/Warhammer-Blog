import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Puff } from 'react-loader-spinner';
import LikeButton from '../components/postLikeButton';
import Likes from '../components/postLikeCounts';
import '../styles/home.css';
import aquilaimage from '../assets/40k_imperial_aquila__transparent__by_fuguestock_d91enql.png'
import BookmarkButton from '../components/postBookmarkButton';



function Home() {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [getErrors, setGetErrors] = useState();
  const navigate = useNavigate();

  useEffect(() =>{
    async function getPublishedPost() {
        try{
            const res = await axios.get('https://warhammer-blog-backend.onrender.com/api/post/published/posts')
            setPosts(res.data.getAllPublishPosts);
        } catch(err){
            setGetErrors("failed to load posts")          
        }
    }
    getPublishedPost();
}, [jsonwebtoken]);

const displayPost = (postId) => {
  navigate(`/post/${postId}`)
}


  return (
  <>
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="header-content">
          <img src={aquilaimage} alt="Aquila Left" className="header-aquila left" />
          <h1>The Emperor's Knowledge</h1>
          <img src={aquilaimage} alt="Aquila Right" className="header-aquila right" />
        </div>
        <p className="header-tagline">Illuminating the darkness of ignorance with the light of the Imperium's truth</p>
      </header>
      {getErrors ? (
        <p className="error-message">{getErrors}</p>
      ) : (
        <div className="featured-posts">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div onClick={() => displayPost(post.id)} className="post-image-container">
                  <img src={post.postImageUrl} alt={post.title} className="post-image" />
                </div>
                <div className="post-content">
                  <h2 className="post-title" onClick={() => displayPost(post.id)}>{post.title}</h2>
                  <p className="post-excerpt">{post.excerpt}...</p>
                  <div className="post-actions">
                    <LikeButton postId={post.id} />
                    <BookmarkButton postId={post.id} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-posts-message">There are no posts to show.</p>
          )}
        </div>
      )}
    </div>
  </>

  )
}

export default Home