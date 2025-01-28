const express = require("express");
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment")
require('dotenv').config();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");

const app = express()
app.use(express.static(path.join(__dirname, 'frontend/blog-frontend')))
app.use('/static', express.static(path.join(__dirname, 'images')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/post/', postRoutes);
app.use('/api/comment/', commentRoutes);



app.listen(5000, ()=> {console.log("server started on post 5000")})