const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("../passport");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.get_user = (req, res) =>{
    res.json({user: req.user})
}

exports.login_post = [
    body("usernameOrEmail", "your username/email must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
    body("password", "your password must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            res.status(400).json({message: errors.errors[0].msg })    
        } else {
            passport.authenticate('local', {session: false}, (err, user, info) =>{
                if(err || !user){
                    const message = info ? info.message : "Invalid Credentials";
                    return res.status(400).json({message});
                }
                const token = jwt.sign({sub: user.id}, process.env.jwtsecrect);
                return res.json({ token, user });
            })(req, res, next)
        }
    })
];
