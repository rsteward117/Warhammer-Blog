import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);

  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();
  const [userProfile, setUserProfile] = useState();
  const {userId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
        try{
            const res = await axios.get(`${BACKEND_URL}/api/user/${userId}`)
            console.log(res.data.user);
        }catch(err){
            setGetErrors();
        }
    }
    getUser();
  }, [userId])

  const displayPost = (postId) => {
    navigate(`/post/${postId}`)
  }
  
  return (
    <div>
      {!userProfile ? (
        <p>Loading user profile...</p>
      ) : (
        <>
          <h1>{userProfile.username}'s Profile</h1>
          <img
            src={userProfile.profilePicUrl}
            alt="Profile picture"
            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
          />
          <p>{userProfile.bio}</p>
  
          <h1>{userProfile.username}'s Post</h1>
          {userProfile.posts && userProfile.posts.length > 0 ? (
            userProfile.posts.map((post, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h3 onClick={() => displayPost(post.id)}>{post.title}</h3>
                {post.postImageUrl && (
                  <img
                    src={post.postImageUrl}
                    alt={`${post.title} cover`}
                    style={{ width: '200px', height: 'auto' }}
                  />
                )}
                <p>{post.excerpt}</p>
              </div>
            ))
          ) : (
            <p>This user doesn't have any posts</p>
          )}
        </>
      )}
    </div>
  );
  
};

export default UserProfile;