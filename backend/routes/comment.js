const express = require("express");
const router = express.Router();
const passport = require("../passport");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

const commentController = require("../controllers/commentsController");
router.get("/numbers",passport.authenticate('jwt', {session: false}), commentController.user_get_comments_numbers)
router.get("/user/comments", passport.authenticate('jwt', {session: false}), commentController.get_user_comments)
router.get("/:postId/comments", commentController.get_all_post_comments);
router.post("/:postId/createcomment", passport.authenticate('jwt', {session: false}), commentController.create_comment);
router.put("/:postId/:commentId/edit", passport.authenticate('jwt', {session: false}), commentController.update_comment);
router.post("/:commentId/like", passport.authenticate('jwt', {session: false}), commentController.like_comment);
router.get('/:commentId/likes', commentController.like_count);
//the route to delete a comment
router.delete("/:postId/:commentId/delete", passport.authenticate('jwt', {session: false}), commentController.delete_post_comment);
router.post("/:postId/:commentId/createReply", passport.authenticate('jwt', {session: false}), commentController.create_comment_reply);
module.exports = router;