import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import EditComment from './editComment';
import CommentLikeButton from '../components/commentLikeButton';
import ReplyToComment from './replyComment';

const RenderReplies = ({postId}) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [getErrors, setGetErrors] = useState();
  const [editCommentId, setEditCommentId] = useState(null);
  const [replyId, setReplyId] = useState(null);
  const {commentId} = useParams();
  const navigate = useNavigate();

const htmlDecode = (content) => {
  let e = document.createElement('div');
  e.innerHTML = DOMPurify.sanitize(content);
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

const deleteComment = async (commentId) => {
    try{
        const res = await axios.delete(`http://localhost:5000/api/comment/${postId}/${commentId}/delete`, { 
                headers: {
                    Authorization: `Bearer ${jsonwebtoken}`,
                },
            });
         if(res.status === 200){
            setTimeout(() => location.reload(), 500);
          }
    } catch(err){
        setGetErrors(err.response.data.message)          
    }
}

const getCommentId = (id) => {
    setEditCommentId(id);
}

const cancelCommentEdit = () => {
    setEditCommentId(null);
};

const getReplyId = (id) => {
    setReplyId(id);
}

const cancelReply = () => {
    setReplyId(null);
};




const renderReplies = (replies) => {
    return replies.map((reply) => (
      <div key={reply.id} style={{ marginLeft: '20px', borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
        <div>
          <h2>{reply.user.username}</h2>

          {editCommentId === reply.id ? (
            <EditComment 
                currentContent={reply.comment}
                postId={postId}
                commentId={reply.id}
                setEditCommentId={setEditCommentId}
            />
        ):(
            <>
                <section
                className="preview-content"
                style={{ lineHeight: '1.6', fontSize: '18px', marginTop: '20px' }}
                dangerouslySetInnerHTML={{ __html: htmlDecode(reply.comment) }}
                />
                <h2>{new Date(reply.createdAt).toLocaleString()}</h2>
            </>
        )}
          <CommentLikeButton commentId={reply.id} />
          { user && (user.id === reply.user.id || user.role === 'admin') && (
            <div>
                {editCommentId === reply.id ? (
                    <button onClick={cancelCommentEdit}>Cancel comment Edit</button>

                ):(
                    <button onClick={() => getCommentId(reply.id)}>
                        Edit
                    </button>
                )}

                {replyId === reply.id ? (
                    <button onClick={cancelReply}>Cancel reply</button>

                ):(
                    <button onClick={() => getReplyId(reply.id)}>
                        Reply to Comment
                    </button>
                )}
                <button onClick={() => deleteComment(reply.id)}>
                    Delete
                </button>
                {replyId === reply.id &&
                    <ReplyToComment
                        postId={postId}
                        commentId={reply.id}
                        setReplyId={setReplyId}
                    />
                 }
            </div>
        )}
        </div>
        {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies)}
      </div>
    ));
  };

};
export default RenderReplies;