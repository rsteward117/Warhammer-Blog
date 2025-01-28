const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.signup_post = [
    //validate the fields
    body("username", "your username must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape()
    .custom(async (val) =>{
        const user = await prisma.user.findUnique({where: {username: val} });
        if(user){
            throw new Error("that user already exist!")
        }
    }),
    body("email", "your email must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape()
    .isEmail()
    .withMessage("please entera vaild email.")
    .escape()
    .custom(async (val) =>{
        const user = await prisma.user.findUnique({where: {email: val} });
        if(user){
            throw new Error("that email already exist!")
        }
    }),
    body("password", "your password must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
    body("cPassword")
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage("confirm password must not be empty.")
    .custom((val, {req}) =>{
        return val === req.body.password;
    })
    .withMessage("confirm password must match password."),

    asyncHandler(async (req, res, next) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            //if there are errors in the sign up form set the status code to 400, so that the frontend doesn't navigate to "login" and return the error messages from express-validator
            res.status(400).json({message: errors.errors[0].msg})
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await prisma.user.create({
                data: {
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                },
            });
            // set the status code to 201 and return a json message to the frontend to let them know that the signup was successful
            res.status(201).json({ message: "Signup successful! Please log in." });
        }
    }),
];