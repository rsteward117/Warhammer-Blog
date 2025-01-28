const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
require('dotenv').config();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const {PrismaClient} = require('@prisma/client');
const { rejects } = require("assert");
const { error } = require("console");
const { create } = require("domain");
const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.get_user_post = asyncHandler(async (req, res, next) => {
    const getUserPost = await prisma.post.findMany({
        where: {
            authorId: req.user.id
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            title: true,
            postImageUrl: true,
            createdAt: true,
            status: true,
            excerpt: true,
            viewCount: true,
            likeCount: true,
        },
        
    })
    res.json({getUserPost});
});

exports.user_get_posts_numbers = asyncHandler(async (req, res, next) => {
    const [postLikeCount, postViewCount, postCount, draftPostCount, publishPostCount, likedPostCount, bookmarkPostCount] = await Promise.all([
        prisma.post.aggregate({
            where:{ 
                authorId: req.user.id
             },
             _sum: {
                likeCount: true,
             },
        }),
        prisma.post.aggregate({
            where:{
                authorId: req.user.id  
             },
             _sum: {
                viewCount: true,
             },
        }),
        prisma.post.count({
            where:{
                authorId: req.user.id  
             },
        }),
        prisma.post.count({
            where:{
                authorId: req.user.id,
                status: 'draft' 
            }
        }),
        prisma.post.count({
            where:{
                authorId: req.user.id, 
                status: 'published' 
            },
        }),
        prisma.postlikes.count({
            where:{
                userId: req.user.id
            }
        }),
        prisma.bookmark.count({
            where:{
                userId: req.user.id
            }
        }),
    ]);
    res.json({
        likeCount: postLikeCount._sum.likeCount ?? 0,
        viewCount: postViewCount._sum.viewCount ?? 0,
        postCount: postCount,
        draftPostCount: draftPostCount,
        publishPostCount: publishPostCount,
        likedPostCount: likedPostCount,
        bookmarkPostCount: bookmarkPostCount,
    });
});

exports.get_user_recent_posts = asyncHandler(async (req, res, next) => {
    const getRecentPosts = await prisma.post.findMany({
        where:{
            authorId: req.user.id, 
        },  
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    })
    res.json({getRecentPosts})
});

exports.get_user_draft_posts = asyncHandler(async (req, res, next) => {
    const getDraftedPosts = await prisma.post.findMany({
        where:{
            authorId: req.user.id, 
            status: 'draft'
        },  
        orderBy: {
            createdAt: 'desc',
        },
    })
    res.json({getDraftedPosts})
});

exports.get_user_liked_posts = asyncHandler(async (req, res, next) => {
    const getLikedPosts = await prisma.postlikes.findMany({
        where:{
            userId: req.user.id
        },
        include: {
            post: {select: {id: true, title: true, excerpt: true}},
        },
        orderBy: {
            id: 'desc',
        },
    })
    res.json({getLikedPosts})
});

exports.get_user_bookmark_posts = asyncHandler(async (req, res, next) => {
    const getBookmarkPosts = await prisma.bookmark.findMany({
        where:{
            userId: req.user.id
        },
        include: {
            post: {select: {id: true, title: true, excerpt: true}},
        },
        orderBy: {
            id: 'desc',
        },
    })
    res.json({getBookmarkPosts})
});

exports.get_all_post = asyncHandler(async (req, res, next) => {
    const getAllPublishPosts = await prisma.post.findMany({
        where: {status: "published"},
    })
    res.json({getAllPublishPosts});
})

exports.get_post_by_id = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);

    await prisma.post.update({
        where: {id: postId},
        data: {
            viewCount: {
                increment: 1,
            },
        },
    });

    const post = await prisma.post.findUnique({
        where: {id: postId},
        include: {
            author: {select: {username: true, profilePicUrl: true, id: true}},
            categories: true,
            tags: true,
        },
    });

    if(!post){
        res.status(404).json({message: 'post not found'});
    } else{
        res.json(post);
    }
});

exports.get_tags = asyncHandler(async (req, res, next) => {
    const tags = await prisma.tag.findMany({
        select: {
            name: true,
        },
        take: 5,
    });
    res.json(tags);
});

exports.get_categories = asyncHandler(async (req, res, next) => {
    const categories = await prisma.category.findMany({
        select: {
            name: true,
        },
        take: 5,
    });
    res.json(categories);
});

exports.create_post = [

    body("title")
    .notEmpty().withMessage("A Title is required")
    .isLength({min: 5, max: 100}).withMessage("Title must be between 5 and 100 characters")
    .escape(),
    body("content")
    .notEmpty().withMessage("Some content is required")
    .escape(),
    body("category")
    .notEmpty().withMessage("Category is required")
    .escape(),
    body("tags")
    .notEmpty().withMessage("A tag is required")
    .escape(),



    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.file);
        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg })    
        } else{
            if(!req.file){
                res.status(400).json({message: "no image file"})
            }
           const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
                }).end(req.file.buffer); 
              });

            const url = uploadResult.secure_url;

            await prisma.post.create({
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    author: {
                        connect: {
                            id: req.user.id
                        }
                    },
                    excerpt: req.body.excerpt,
                    categories: {
                        connectOrCreate: {
                            where: { name: req.body.category },
                            create: { name: req.body.category },                   
                        }
                    },
                    tags: {
                        connectOrCreate: req.body.tags.split(',').map((tag) => ({
                            where: { name: tag.trim() },
                            create: { name: tag.trim() },
                        })),
                    },
                    postImageUrl: url
                },
            });
            res.status(200).json({ message: "post is created" });
        }
    })
];

exports.save_post_as_draft = [ 
    body("category")
    .notEmpty().withMessage("Category is required before saving")
    .escape(),
    body("tags")
    .notEmpty().withMessage("A tag is required before saving")
    .escape(),
    
    
    asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let url = null;

    if(!errors.isEmpty()){
        res.status(400).json({message: errors.errors[0].msg })    
    }

    if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }).end(req.file.buffer); 
            });
        url = uploadResult.secure_url;
    }

    await prisma.post.create({
        data: {
            title: req.body.title,
            content: req.body.content,
            status: 'draft',
            author: {
                connect: {
                    id: req.user.id
                }
            },
            excerpt: req.body.excerpt,
            categories: {
                connectOrCreate: {
                    where: { name: req.body.category },
                    create: { name: req.body.category }                    
                }
            },
            tags: {
                connectOrCreate: req.body.tags.split(',').map((tag) => ({
                    where: { name: tag.trim() },
                    create: { name: tag.trim() }
                })),
            },
            postImageUrl: url
        },
    });
    res.status(200).json({ message: "post was saved as draft" });
}),

];

exports.save_edited_post_as_draft = [ 
    body("category")
    .notEmpty().withMessage("Category is required before saving")
    .escape(),
    body("tags")
    .notEmpty().withMessage("A tag is required before saving")
    .escape(),

    asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const postId = parseInt(req.params.postId, 10);
    let url = null;

    if(!errors.isEmpty()){
        res.status(400).json({message: errors.errors[0].msg })    
    }

    if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }).end(req.file.buffer); 
            });
        url = uploadResult.secure_url;
    }

    await prisma.post.update({
        where: {id: postId},
        data: {
            title: req.body.title,
            content: req.body.content,
            status: 'draft',
            author: {
                connect: {
                    id: req.user.id
                }
            },
            excerpt: req.body.excerpt,
            categories: {
                connectOrCreate: {
                    where: { name: req.body.category },
                    create: { name: req.body.category }                    
                }
            },
            tags: {
                connectOrCreate: req.body.tags.split(',').map((tag) => ({
                    where: { name: tag.trim() },
                    create: { name: tag.trim() }
                })),
            },
            postImageUrl: url
        },
    });
    res.status(200).json({ message: "post was saved as draft" });
}),

];

exports.update_post = [
    body("title")
        .notEmpty().withMessage("A Title is required")
        .isLength({min: 5, max: 100}).withMessage("Title must be between 5 and 100 characters")
        .escape(),
    body("content")
        .notEmpty().withMessage("Some content is required")
        .escape(),
    body("category")
        .notEmpty().withMessage("Category is required")
        .escape(),
    body("tags")
        .notEmpty().withMessage("A tag is required")
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        console.log(req.body)
        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg})    
        } else{
            const postId = parseInt(req.params.postId, 10);
            const {title, content, tags, excerpt, category} = req.body;

            const currentData = {
                title,
                content,
                excerpt,
                categories: {
                    connectOrCreate: {
                        where: { name: category },
                        create: { name: category },
                    },
                },
                tags: {
                    set: [],
                    connectOrCreate: tags.split('.').map((tag) => ({
                        where: { name: tag.trim() },
                        create: { name: tag.trim() },
                    })),
                },
            };
            const updatePost = await prisma.post.update({
                where: {id: postId},
                data: currentData,
            });

            res.status(200).json({ message: "post update successfully", post: updatePost});
        }
    })
];

exports.delete_post = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    console.log('User:', req.user);
    console.log(postId);

    const deletePost = await prisma.post.delete({
        where: {
            id: postId,
        }
    })
    res.status(200).json({ message: "post was deleted" });
})

exports.publish_post = asyncHandler(async (req, res, next) => {

    const postId = parseInt(req.params.postId, 10);

    const publishPost = await prisma.post.update({
        where: {id: postId},
        data: {
            status: 'published',
        },
    });
    res.status(200).json({message: 'Your Post is now published'})
});

exports.search = asyncHandler(async (req, res, next) => {

    //'term' is the search bar input that's being sent to the backend from the frontend
    const {term} = req.query;

    console.log("Search term:", term);

    const searchResults = await prisma.post.findMany({
        //prisma is going to search for post(s) based on if "term" fits one of the condtions below so if term has the word "tech" in it prisma get all posts that has tech in its "title" "content" "tags" or "categories" fields
        where: {
            status: 'published',
            OR:[
                {title: {contains: term, mode: 'insensitive'} },
                {tags: {some: {name: {contains: term, mode: 'insensitive'}}}},
                {categories: {some: {name: {contains: term, mode: 'insensitive'}}}},
            ]
        },        
        include: {
            tags: true,
            categories: true,
        },
    });
    res.json(searchResults);
})

// controllers/postController.js
exports.get_posts_by_tags_categories = asyncHandler(async (req, res) => {
    const { term } = req.query;
  
    const [categoryMatches, tagMatches] = await Promise.all([
      prisma.category.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              postImageUrl: true,
              excerpt: true,
              categories: true,
            },
          },
        },
      }),
      prisma.tag.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              postImageUrl: true,
              excerpt: true,
              categories: true,
            },
          },
        },
      }),
    ]);
  
    // Flatten the nested posts arrays and combined them into one array. with this there would be 2 diffrent arraies one for category and tags and one for the post that nested within category and tags. the frontend wont be able to the data from the post without this.
    const postsFromCategories = categoryMatches.flatMap((cat) => cat.posts);
    const postsFromTags = tagMatches.flatMap((tag) => tag.posts);
  
    // Combine them
    const combinedPosts = [...postsFromCategories, ...postsFromTags];
  
    //remove duplicate posts if a post appears in both
    const uniquePosts = Array.from(
      new Map(combinedPosts.map((p) => [p.id, p])).values()
    );
    
    res.json(uniquePosts);
  });
  
  

exports.get_suggestions  = asyncHandler(async (req, res, next) => {

    //'term' is the search bar input that's being sent to the backend from the frontend
    const {term} = req.query;

    console.log("Search term:", term);

    const searchCategories  = await prisma.category.findMany({
        //prisma is going to search for post(s) based on if "term" fits one of the condtions below so if term has the word "tech" in it prisma get all posts that has tech in its "title" "content" "tags" or "categories" fields
        where: {
            name: {
                contains: term,
                mode: 'insensitive',
            },
        },        
        select: {name: true},
    });

    const searchTags  = await prisma.tag.findMany({
        //prisma is going to search for post(s) based on if "term" fits one of the condtions below so if term has the word "tech" in it prisma get all posts that has tech in its "title" "content" "tags" or "categories" fields
        where: {
            name: {
                contains: term,
                mode: 'insensitive',
            },
        },        
        select: {name: true},
    });
    res.json({searchCategories, searchTags});
})

exports.like_post = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.user.id;

    const existingLike = await prisma.Postlikes.findUnique({
        where: {
            userId_postId:{
                userId,
                postId
            },
        },
    });

    if(existingLike){
        await prisma.$transaction([
            prisma.Postlikes.delete({
                where: {
                    userId_postId:{
                        userId,
                        postId
                    },             
                },
            }),
            prisma.post.update({
                where: {id: postId},
                data: {likeCount: {decrement: 1}},
            }),
        ]);
        res.json({message: 'post has been unliked!', liked: false});
    }else{

        await prisma.$transaction([
            prisma.Postlikes.create({
                data: {
                    postId,
                    userId
                },
            }),
            prisma.post.update({
                where: {id: postId},
                data: {likeCount: {increment: 1}},
            }),
        ]);
        res.json({message: 'post has been liked!', liked: true});
    }
})

exports.like_count = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    
    const likeCount = await prisma.post.findUnique({
        where: {id: postId},
        select: {likeCount: true}
    });

  res.json(likeCount);  
});

exports.admin_get_recent_posts = asyncHandler(async (req, res, next) => {
    const getRecentPosts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    })
    res.json({getRecentPosts})
});

exports.admin_get_all_posts = asyncHandler(async (req, res, next) => {
    const getAllPost = await prisma.post.findMany({

    })

    res.json({getAllPost})
})

exports.admin_get_posts_numbers = asyncHandler(async (req, res, next) => {
    const [postCount, draftPostCount, publishPostCount] = await Promise.all([
        prisma.post.count({

        }),
        prisma.post.count({
            where:{ status: 'draft' }
        }),
        prisma.post.count({
            where:{ status: 'published' },
        }),
    ]);
    res.json({
        total: postCount,
        draft: draftPostCount,
        published: publishPostCount
    });
});

exports.bookmark_post = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.user.id;
  
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  
    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return res.json({ message: 'Post has been removed from bookmark!', marked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });
      return res.json({ message: 'Post has been added to bookmark!', marked: true });
    }
  });
  





