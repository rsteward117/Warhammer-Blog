import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import {TextField, Box, Grid, Button, Grid2} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
 
const EditComment = ({currentContent, postId, commentId, setEditCommentId}) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    comment: currentContent
  });
  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();


  const handleCommentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      comment: value,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try{
        const res = await axios.put(`http://localhost:5000/api/comment/${postId}/${commentId}/edit`, 
            {comment: formData.comment},
            {headers: {
                Authorization: `Bearer ${jsonwebtoken}`,
            }, 
        })

        if(res.status === 200){
          //if the post response status code returns "201" then set the serverResponse useState to the response message and have a slight delay to navagate to login.
          setServerResponse(res.data.message)
          
          setTimeout(() =>{
            setEditCommentId(null);
            window.location.reload();
          }, 500)
        }


    } catch (err){

    }
};

  const quillModules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['link', 'image'], // Link and image
      ['clean'] // Remove formatting
    ]
  };

  const htmlDecode = (content) => {
    let e = document.createElement('div');
    e.innerHTML = DOMPurify.sanitize(content);
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue || e.innerHTML;
  }

  return (
    <div>
        <Box sx={{mb: 3}}>
            <h1>Edit comment</h1>
                <form onSubmit={handleEdit} >
                {getErrors && <p>{getErrors}</p>}
                {serverResponse && <p>{serverResponse}</p>}

                <Grid2 xs={12} marginBottom={8}>
                    <label for="comment"></label>
                    <ReactQuill
                        value={htmlDecode(formData.comment)}
                        onChange={handleCommentChange}
                        theme="snow"
                        modules={quillModules}
                        style={{ height: '100px', marginBottom: '20px' }}
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Edit Comment
                    </Button>
                </Grid2>
            </form>
      </Box>
    </div>
  );
};

export default EditComment;