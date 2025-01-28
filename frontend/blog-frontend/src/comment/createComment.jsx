import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import {TextField, Box, Grid, Button, Grid2} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
 
const CreateComment = ({ postId }) => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    comment: ''
  });
  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();


  const handleSubmit = async (e) => {
    e.preventDefault();


    try{
        const res = await axios.post(`http://localhost:5000/api/comment/${postId}/createcomment`, {comment: formData.comment} ,{
          headers: {
            Authorization:  `Bearer ${jsonwebtoken}`,
            'Content-Type': 'application/json'
          },
        });
        if(res.status === 200){
          //if the post response status code returns "201" then set the serverResponse useState to the response message and have a slight delay to navagate to login.
          setServerResponse(res.data.message)
          setTimeout(() =>{
            window.location.reload();
          }, 500)
        }
      } catch (err){
        setGetErrors(err.response.data.message)
        console.log(err)
      }

  }

  const handleCommentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      comment: value,
    }));
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
 

  return (
    <div>
        <Box sx={{mb: 3}}>
            <h1>Create a comment</h1>
                <form onSubmit={handleSubmit} >
                {getErrors && <p>{getErrors}</p>}
                {serverResponse && <p>{serverResponse}</p>}

                <Grid2 xs={12} marginBottom={8}>
                    <label for="comment"></label>
                    <ReactQuill
                        value={formData.comment}
                        onChange={handleCommentChange}
                        theme="snow"
                        modules={quillModules}
                        style={{ height: '100px', marginBottom: '20px' }}
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        post Comment
                    </Button>
                </Grid2>
            </form>
      </Box>
    </div>
  );
};

export default CreateComment;