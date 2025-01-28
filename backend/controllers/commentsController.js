const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
require('dotenv').config();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const {PrismaClient} = require('@prisma/client');
const { rejects } = require("assert");
const { connect } = require("http2");
const prisma = new PrismaClient();

//work on adding a system for comments to like and replie on to other comments


exports.get_all_post_comments = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);

    const getAllPostComments = await prisma.comment.findMany({
        where: {
            postId: postId,
            parentId: null
        },
        include: {
            user: {
                select: {
                    username: true,
                    profilePicUrl: true,
                },
            },
            replies: {
                include: {
                    user: true,
                },
            },
        },
    });
    res.json({getAllPostComments});
})

exports.get_user_comments = asyncHandler(async (req, res, next) => {

    const getUserComments = await prisma.comment.findMany({
        where: {
            userId: req.user.id
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
    res.json({getUserComments});
})

exports.create_comment = [

    body("comment")
    .notEmpty().withMessage("Comments can't be empty")
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.body);
        const postId = parseInt(req.params.postId, 10);




        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg })    
        } else{
            await prisma.comment.create({
                data:{
                    comment: req.body.comment,
                    post: {
                        connect: {id: postId},
                    },
                    user: {
                        connect: {id: req.user.id},
                    },
                },
            });
            res.status(200).json({ message: "comment was created" });
        }
    })
];

//you left off here
exports.update_comment = [

    body("comment")
    .notEmpty().withMessage("Comments can't be empty")
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.body);
        const postId = parseInt(req.params.postId, 10);
        const commentId = parseInt(req.params.commentId, 10);

        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg })    
        } else{
            await prisma.comment.update({
                where: {
                    id: commentId,
                    postId: postId,

                },
                data:{
                    comment: req.body.comment,
                },
            });
            res.status(200).json({ message: "comment was updated" });
        }
    })
];

//delete a comment conntroller
exports.delete_post_comment = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    const commentId = parseInt(req.params.commentId, 10);

    const deletePostComment = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })
    res.status(200).json({ message: "comment was deleted" });
})

exports.like_comment = asyncHandler(async (req, res, next) => {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = req.user.id;

    const existingLike = await prisma.Commentlikes.findUnique({
        where: {
            userId_commentId:{
                userId,
                commentId
            },
        },
    });

    if(existingLike){
        await prisma.$transaction([
            prisma.commentlikes.delete({
                where: {
                    userId_commentId:{
                        userId,
                        commentId
                    },             
                },
            }),
            prisma.comment.update({
                where: {id: commentId},
                data: {likeCount: {decrement: 1}},
            }),
        ]);
        res.json({message: 'comment has been unliked!', liked: false});
    }else{

        //$transaction is way for prisma to update 2 or database model at the same time, and if one of them fail they both fail. in this case the commentLikes will add a new user, and the like counter for the comments model if increase. 
        await prisma.$transaction([
            prisma.commentlikes.create({
                data: {
                    commentId,
                    userId
                },
            }),
            prisma.comment.update({
                where: {id: commentId},
                data: {likeCount: {increment: 1}},
            }),
        ]);
        res.json({message: 'comment has been liked!', liked: true});
    }
})

exports.like_count = asyncHandler(async (req, res, next) => {
    const commentId = parseInt(req.params.commentId, 10);
    
    const likeCount = await prisma.comment.findUnique({
        where: {id: commentId},
        select: {likeCount: true}
    });

  res.json(likeCount);  
});

exports.create_comment_reply = [

    body("comment")
    .notEmpty().withMessage("Comments can't be empty")
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.body);
        const postId = parseInt(req.params.postId, 10);
        const commentId = parseInt(req.params.commentId, 10);


        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg })    
        } else{

            const existingComment = await prisma.comment.findUnique({
                where: {id: commentId},
            });

            if(!existingComment) {
                res.status(400).json({message: 'that comment not found'});
            }

            await prisma.comment.create({
                data:{
                    comment: req.body.comment,
                    post: {
                        connect: {id: postId},
                    },
                    user: {
                        connect: {id: req.user.id},
                    },
                    parent: {
                        connect: {id: commentId},
                    },
                    createdAt: new Date(),
                },
            });
            res.status(200).json({ message: "reply has been created" });
        }
    })
];


exports.user_get_comments_numbers = asyncHandler(async (req, res, next) => {
    const getCommentNumber = await prisma.comment.count({
            where:{
               userId: req.user.id  
             },
        })
    res.json(getCommentNumber);
});