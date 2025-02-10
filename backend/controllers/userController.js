const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
require('dotenv').config();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const {cloudinaryStorage, CloudinaryStorage} = require("multer-storage-cloudinary");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.get_user_by_id = asyncHandler(async (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            posts: {select: {title: true, excerpt: true, postImageUrl: true, id: true}},
        },
    });
    res.json(user);
})

exports.username_post = [
    //validate the fields
    body("username", "your username must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),

    asyncHandler(async (req, res, next) =>{
        console.log(req.body);
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg})
        } else {
            await prisma.user.update({
                where: {id: req.user.id},
                data: {
                    username: req.body.username,
                },
            });
            res.status(200).json({message: 'username updated successfully'})
        }
    }),
];

exports.bio_post = [
    //validate the fields
    body("bio", "your bio must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),

    asyncHandler(async (req, res, next) =>{
        console.log(req.body);
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg})
        } else {
            await prisma.user.update({
                where: {id: req.user.id},
                data: {
                    bio: req.body.bio,
                },
            });
            res.status(200).json({message: 'Bio updated successfully'})
        }
    }),
];


exports.profilePic_post = asyncHandler(async (req, res, next) =>{

    const uploadResult = cloudinary.uploader.upload_stream(
        {resource_type: "auto"},
        async(err, result) => {
            if(err){
                return res.status(500).json({message: 'error trying to upload file.'});
            }
            const url = result.secure_url;
            await prisma.user.update({
                where: {id: req.user.id},
                data:{profilePicUrl: url},
            });
            res.status(200).json({message: 'Profile picture updated successfully'})
        }
    );
    uploadResult.end(req.file.buffer)
});

exports.admin_get_all_users = asyncHandler(async (req, res, next) => {
    const getAllUsers = await prisma.user.findMany({
        orderBy: {
            id: 'desc',
        },
        include: {
            _count: {
                select: {posts: true},
            },
        },
    })

    res.json({getAllUsers})
})

exports.admin_get_user_numbers = asyncHandler(async (req, res, next) => {
    const getUserNumber = await prisma.user.count({

    })
    res.json({getUserNumber})
});

exports.admin_get_recent_users = asyncHandler(async (req, res, next) => {
    const getRecentUsers = await prisma.user.findMany({
        orderBy: {
            id: 'desc',
        },
        take: 3,
        include: {
            _count: {
                select: {posts: true},
            },
        },
    })
    res.json({getRecentUsers})
});

exports.admin_promote_user = asyncHandler(async (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);

    const promoteUserRole = await prisma.user.update({
        where: {id: userId},
        data: {
            role: 'admin',
        },
    })
})