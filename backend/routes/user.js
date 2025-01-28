const express = require("express");
const router = express.Router();
const passport = require("../passport");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

const userController = require("../controllers/userController");

router.get("/allUsers", passport.authenticate('jwt', {session: false}), userController.admin_get_all_users);
router.get("/recentusers",  passport.authenticate('jwt', {session: false}), userController.admin_get_recent_users);
router.get("/user/numbers",  passport.authenticate('jwt', {session: false}), userController.admin_get_user_numbers);
router.post("/username", passport.authenticate('jwt', {session: false}), userController.username_post);
router.post("/bio", passport.authenticate('jwt', {session: false}), userController.bio_post);
router.post("/profilepic", passport.authenticate('jwt', {session: false}), upload.single("profilepic"), userController.profilePic_post);
router.get("/:userId", userController.get_user_by_id);
router.put("/:userId/promote", passport.authenticate('jwt', {session: false}), userController.admin_promote_user);
module.exports = router;