import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import EditComment from './editComment';
import CommentLikeButton from '../components/commentLikeButton';
import ReplyToComment from './replyComment';
import '../styles/comments.css';

const Comments = ({ postId }) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [getErrors, setGetErrors] = useState();
  const [editCommentId, setEditCommentId] = useState(null);
  const [replyId, setReplyId] = useState(null);
  const { commentId } = useParams();

  useEffect(() => {
    async function getComments() {
      try {
        const res = await axios.get(`http://localhost:5000/api/comment/${postId}/comments`);
        setComments(res.data.getAllPostComments);
      } catch (err) {
        setGetErrors(err.response?.data?.message || "Failed to load comments");
      }
    }
    getComments();
  }, [jsonwebtoken, postId]);

  const htmlDecode = (content) => {
    let e = document.createElement('div');
    e.innerHTML = DOMPurify.sanitize(content);
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/comment/${postId}/${commentId}/delete`,
        { headers: { Authorization: `Bearer ${jsonwebtoken}` } }
      );
      if (res.status === 200) {
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err) {
      setGetErrors(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const getCommentId = (id) => {
    setEditCommentId(id);
  };

  const cancelCommentEdit = () => {
    setEditCommentId(null);
  };

  const getReplyId = (id) => {
    setReplyId(id);
  };

  const cancelReply = () => {
    setReplyId(null);
  };

  if (!comments) return <p className="loading-message">Loading...</p>;
  if (comments.length === 0) return <p className="no-comments-message">This post has no comments. Be the first!</p>;

  // Recursively render replies
  const renderReplies = (replies, level = 1) => {
    return replies.map((reply) => (
      <div key={reply.id} className="comment-reply-wrapper">
        <div className="comment" style={{ marginLeft: `${level * 40}px` }}>
          <div className="comment-left">
            <img
              src={reply.user?.profilePicUrl || '/default-profile-pic.jpg'}
              alt='User profile'
              className="comment-author-img"
            />
          </div>
          <div className="comment-right">
            <div className="comment-header">
              <span className="comment-author-name">{reply.user.username}</span>
              <span className="comment-timestamp">{new Date(reply.createdAt).toLocaleString()}</span>
            </div>
            <div className="comment-body">
              {editCommentId === reply.id ? (
                <EditComment
                  currentContent={reply.comment}
                  postId={postId}
                  commentId={reply.id}
                  setEditCommentId={setEditCommentId}
                />
              ) : (
                <div
                  className="comment-content"
                  dangerouslySetInnerHTML={{ __html: htmlDecode(reply.comment) }}
                />
              )}
            </div>
            <div className="comment-actions">
              <CommentLikeButton commentId={reply.id} />
              {user && (user.id === reply.user.id || user.role === 'admin') && (
                <>
                  {editCommentId === reply.id ? (
                    <button className="comment-action-button" onClick={cancelCommentEdit}>Cancel Edit</button>
                  ) : (
                    <button className="comment-action-button" onClick={() => getCommentId(reply.id)}>Edit</button>
                  )}

                  {replyId === reply.id ? (
                    <button className="comment-action-button" onClick={cancelReply}>Cancel Reply</button>
                  ) : (
                    <button className="comment-action-button" onClick={() => getReplyId(reply.id)}>Reply</button>
                  )}

                  <button className="comment-action-button delete-button" onClick={() => deleteComment(reply.id)}>Delete</button>
                </>
              )}

              {replyId === reply.id && (
                <ReplyToComment
                  postId={postId}
                  commentId={reply.id}
                  setReplyId={setReplyId}
                />
              )}
            </div>
          </div>
        </div>
        {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
      </div>
    ));
  };

  return (
    <div className="comments-container">
      {getErrors && <p className="error-message">{getErrors}</p>}
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-left">
            <img
              src={comment.user?.profilePicUrl || '/default-profile-pic.jpg'}
              alt='User profile'
              className="comment-author-img"
            />
          </div>
          <div className="comment-right">
            <div className="comment-header">
              <span className="comment-author-name">{comment.user?.username}</span>
              <span className="comment-timestamp">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>

            <div className="comment-body">
              {editCommentId === comment.id ? (
                <EditComment
                  currentContent={comment.comment}
                  postId={postId}
                  commentId={comment.id}
                  setEditCommentId={setEditCommentId}
                />
              ) : (
                <div
                  className="comment-content"
                  dangerouslySetInnerHTML={{ __html: htmlDecode(comment.comment) }}
                />
              )}
            </div>

            <div className="comment-actions">
              <CommentLikeButton commentId={comment.id} />
              {user && (user.id === comment.user.id || user.role === 'admin') && (
                <>
                  {editCommentId === comment.id ? (
                    <button className="comment-action-button" onClick={cancelCommentEdit}>Cancel Edit</button>
                  ) : (
                    <button className="comment-action-button" onClick={() => getCommentId(comment.id)}>Edit</button>
                  )}

                  {replyId === comment.id ? (
                    <button className="comment-action-button" onClick={cancelReply}>Cancel Reply</button>
                  ) : (
                    <button className="comment-action-button" onClick={() => getReplyId(comment.id)}>Reply</button>
                  )}

                  <button className="comment-action-button delete-button" onClick={() => deleteComment(comment.id)}>Delete</button>
                </>
              )}

              {replyId === comment.id && (
                <ReplyToComment
                  postId={postId}
                  commentId={comment.id}
                  setReplyId={setReplyId}
                />
              )}
            </div>

            {comment.replies && comment.replies.length > 0 && renderReplies(comment.replies, 1)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
