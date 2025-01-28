const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signupController");
const loginController = require("../controllers/loginController");
const passport = require("../passport");

router.get("/", passport.authenticate('jwt', {session: false}), loginController.get_user);
router.post("/signup", signUpController.signup_post);
router.post("/login", loginController.login_post);

module.exports = router;