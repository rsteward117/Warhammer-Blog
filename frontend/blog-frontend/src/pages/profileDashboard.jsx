import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import '../styles/profileDashboard.css'; 
import ProfileSidebar from '../components/profileSidebar';

// React Tabs
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ProfileDashboard = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  // State for various data
  const [recentPosts, setRecentPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [comments, setComments] = useState([]);
  const [bookmarkPost, setBookmarkPost] = useState([]);
  const [commentsStats, setCommentsStats] = useState(0);
  const [postStats, setPostStats] = useState({
    postCount: 0,
    draftCount: 0,
    publishCount: 0,
    likedPostCount: 0,
    bookmarkPostCount: 0,
  });

  // (Optional) Error handling
  const [getErrors, setGetErrors] = useState('');

  useEffect(() => {
    async function getUserRecentPosts() {
      try {
        const res = await axios.get('http://localhost:5000/api/post/user/recent/posts', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` },
        });
        setRecentPosts(res.data.getRecentPosts);
      } catch (err) {
        setGetErrors('Failed to load posts');
      }
    }

    async function getUserDraftPosts() {
      try {
        const res = await axios.get('http://localhost:5000/api/post/user/draft/posts', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` },
        });
        setDrafts(res.data.getDraftedPosts);
      } catch (err) {
        setGetErrors('Failed to load posts');
      }
    }

    async function getUserLikedPosts() {
      try {
        const res = await axios.get('http://localhost:5000/api/post/user/liked/posts', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` },
        });
        setLikedPosts(res.data.getLikedPosts);
      } catch (err) {
        setGetErrors('Failed to load posts');
      }
    }

    async function getUserBookmarkedPosts() {
      try {
        const res = await axios.get('http://localhost:5000/api/post/user/bookmark/posts', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` },
        });
        setBookmarkPost(res.data.getBookmarkPosts);
      } catch (err) {
        setGetErrors('Failed to load posts');
      }
    }

    async function getUserComments() {
      try {
        const res = await axios.get('http://localhost:5000/api/comment/user/comments', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` },
        });
        setComments(res.data.getUserComments);
      } catch (err) {
        setGetErrors('Failed to load comments');
      }
    }

    async function getUserPostsNumbers() {
      try {
        const res = await axios.get('http://localhost:5000/api/post/userpost/numbers', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` },
        });
        setPostStats({
          postCount: res.data.postCount,
          draftCount: res.data.draftPostCount,
          publishCount: res.data.publishPostCount,
          likedPostCount: res.data.likedPostCount,
          bookmarkPostCount: res.data.bookmarkPostCount,
        });
      } catch (err) {
        setGetErrors('Failed to load post stats');
      }
    }

    async function getUserCommentsNumbers() {
      try {
        const res = await axios.get('http://localhost:5000/api/comment/numbers', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` },
        });
        setCommentsStats(res.data);
      } catch (err) {
        setGetErrors('Failed to load comment stats');
      }
    }

    getUserRecentPosts();
    getUserDraftPosts();
    getUserLikedPosts();
    getUserBookmarkedPosts();
    getUserComments();
    getUserCommentsNumbers();
    getUserPostsNumbers();
  }, [jsonwebtoken]);

  // Helper for safely displaying HTML from the backend
  const htmlDecode = (content) => {
    let e = document.createElement('div');
    e.innerHTML = DOMPurify.sanitize(content);
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
  };

  return (
    <div className="profile-dashboard-container">
      {/* Sidebar */}
      <ProfileSidebar />

      {/* Header Section: Personal Info */}
      <header className="profile-dashboard-header">
        <div className="profile-info">
          <img
            src={
              user?.profilePicUrl ||
              'http://localhost:5000/static/blank-profile-picture-973460.svg'
            }
            alt="Profile Avatar"
            className="profile-avatar"
          />
          <div>
            <h1 className="profile-dashboard-title">
              Welcome, {user?.username || 'Acolyte'}!
            </h1>
            <h2 className="profile-email">Email: {user?.email || 'N/A'}</h2>
            <p className="profile-dashboard-subtitle">
              <section
                dangerouslySetInnerHTML={{
                  __html: htmlDecode(
                    user?.bio || 'No bio provided. Share your thoughts with the galaxy!'
                  ),
                }}
              />
            </p>
          </div>
        </div>
      </header>

      {/* Stats Section: Analytics & Metrics */}
      <section className="profile-dashboard-stats">
        <div className="stat-card">
          <h2>Total Posts</h2>
          <p>{postStats.postCount}</p>
        </div>
        <div className="stat-card">
          <h2>Publish</h2>
          <p>{postStats.publishCount}</p>
        </div>
        <div className="stat-card">
          <h2>Drafts</h2>
          <p>{postStats.draftCount}</p>
        </div>
        <div className="stat-card">
          <h2>Liked Posts</h2>
          <p>{postStats.likedPostCount}</p>
        </div>
        <div className="stat-card">
          <h2>Bookmarks</h2>
          <p>{postStats.bookmarkPostCount}</p>
        </div>
        <div className="stat-card">
          <h2>Comments Made</h2>
          <p>{commentsStats}</p>
        </div>
      </section>

      {/* Tabs */}
      <Tabs>
        <TabList>
          <Tab>Recent Posts</Tab>
          <Tab>Drafts</Tab>
          <Tab>Liked Posts</Tab>
          <Tab>Bookmarked Posts</Tab>
          <Tab>Your Comments</Tab>
        </TabList>

        {/* ========== Tab Panel 1: Recent Posts ========== */}
        <TabPanel>
          <div className="profile-tab-container">
            <h1 className="profile-tab-title">Recent Posts</h1>
            {getErrors && <p className="profile-tab-error">{getErrors}</p>}

            {recentPosts.length > 0 ? (
              <div className="profile-tab-list">
                {recentPosts.map((post) => (
                  <div key={post.id} className="profile-tab-item">
                    <h2 className="profile-tab-item-title">{post.title}</h2>
                    {post.postImageUrl && (
                      <img
                        src={post.postImageUrl}
                        alt={post.title}
                        className="profile-tab-image"
                      />
                    )}
                    <p className="profile-tab-excerpt">{post.excerpt}...</p>

                    <div className="profile-tab-actions">
                      <button
                        className="profile-tab-button"
                        onClick={() => navigate(`/post/${post.id}`)}
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="profile-tab-nopost-message">No recent posts found.</p>
            )}
          </div>
        </TabPanel>

        {/* ========== Tab Panel 2: Drafts ========== */}
        <TabPanel>
          <div className="profile-tab-container">
            <h1 className="profile-tab-title">Drafts</h1>
            {getErrors && <p className="profile-tab-error">{getErrors}</p>}

            {drafts.length > 0 ? (
              <div className="profile-tab-list">
                {drafts.map((draft) => (
                  <div key={draft.id} className="profile-tab-item">
                    <h2 className="profile-tab-item-title">{draft.title}</h2>
                    {draft.postImageUrl && (
                      <img
                        src={draft.postImageUrl}
                        alt={draft.title}
                        className="profile-tab-image"
                      />
                    )}
                    <p className="profile-tab-excerpt">{draft.excerpt}...</p>

                    <div className="profile-tab-actions">
                      <button
                        className="profile-tab-button"
                        onClick={() => navigate(`/editPost/${draft.id}`)}
                      >
                        Edit Draft
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="profile-tab-nopost-message">No drafts found.</p>
            )}
          </div>
        </TabPanel>

        {/* ========== Tab Panel 3: Liked Posts ========== */}
        <TabPanel>
          <div className="profile-tab-container">
            <h1 className="profile-tab-title">Liked Posts</h1>
            {getErrors && <p className="profile-tab-error">{getErrors}</p>}

            {likedPosts.length > 0 ? (
              <div className="profile-tab-list">
                {likedPosts.map((liked) => (
                  <div key={liked.post.id} className="profile-tab-item">
                    <h2 className="profile-tab-item-title">{liked.post.title}</h2>
                    {liked.post.postImageUrl && (
                      <img
                        src={liked.post.postImageUrl}
                        alt={liked.post.title}
                        className="profile-tab-image"
                      />
                    )}
                    <p className="profile-tab-excerpt">{liked.post.excerpt}...</p>

                    <div className="profile-tab-actions">
                      <button
                        className="profile-tab-button"
                        onClick={() => navigate(`/post/${liked.post.id}`)}
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="profile-tab-nopost-message">No liked posts yet.</p>
            )}
          </div>
        </TabPanel>

        {/* ========== Tab Panel 4: Bookmarked Posts ========== */}
        <TabPanel>
          <div className="profile-tab-container">
            <h1 className="profile-tab-title">Bookmarked Posts</h1>
            {getErrors && <p className="profile-tab-error">{getErrors}</p>}

            {bookmarkPost.length > 0 ? (
              <div className="profile-tab-list">
                {bookmarkPost.map((bookmark) => (
                  <div key={bookmark.post.id} className="profile-tab-item">
                    <h2 className="profile-tab-item-title">{bookmark.post.title}</h2>
                    {bookmark.post.postImageUrl && (
                      <img
                        src={bookmark.post.postImageUrl}
                        alt={bookmark.post.title}
                        className="profile-tab-image"
                      />
                    )}
                    <p className="profile-tab-excerpt">
                      {bookmark.post.excerpt}...
                    </p>

                    <div className="profile-tab-actions">
                      <button
                        className="profile-tab-button"
                        onClick={() => navigate(`/post/${bookmark.post.id}`)}
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="profile-tab-nopost-message">
                No bookmarked posts yet.
              </p>
            )}
          </div>
        </TabPanel>

        {/* ========== Tab Panel 5: User Comments ========== */}
        <TabPanel>
          <div className="profile-tab-container">
            <h1 className="profile-tab-title">Your Comments</h1>
            {getErrors && <p className="profile-tab-error">{getErrors}</p>}

            {comments.length > 0 ? (
              <div className="profile-tab-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="profile-tab-item">
                    <h2 className="profile-tab-item-title">
                      On Post: {comment.post.title}
                    </h2>
                    <p className="profile-tab-excerpt">
                      <section
                        dangerouslySetInnerHTML={{
                          __html: htmlDecode(comment.comment),
                        }}
                      />
                    </p>

                    <div className="profile-tab-actions">
                      <button
                        className="profile-tab-button"
                        onClick={() => navigate(`/post/${comment.post.id}`)}
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="profile-tab-nopost-message">
                You haven’t commented yet.
              </p>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProfileDashboard;
