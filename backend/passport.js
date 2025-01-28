const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const isEmail = (input) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

passport.use(
    new LocalStrategy({usernameField: 'usernameOrEmail', passwordField: 'password'}, async (usernameOrEmail, password, done) => {
        try {
            let user;
            if(isEmail(usernameOrEmail)) {
                user = await prisma.user.findUnique({where: {email: usernameOrEmail}});
            } else {
                user = await prisma.user.findUnique({where: {username: usernameOrEmail}});
            }
            console.log("User found:", user);
            //compares the password with the bcryptjs hased password from the prisma/postgresql database
            const match = await bcrypt.compare(password, user.password);

            if(!user) {
                return done(null, false, {message: "Incorrect username or email"});
            }
            if(!match) {
                return done(null, false, {message: "Incorrect password"});
            }
            return done(null, user);
        } catch(err){
            return done(err);
        }
    })
);

const opts = {
    secretOrKey:  process.env.jwtsecrect,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),    
}

passport.use(new JwtStrategy(opts, async function(jwt_payload, done){
   const user = await prisma.user.findUnique({
    where: {id: jwt_payload.sub}
   });
   if(user){
    return done(null, user);
   } else {
    return done(null, false);
   }
}));

module.exports = passport

