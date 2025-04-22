const express = require('express');
const router = express.Router();
const User = require("../models/User.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const {SignUpPage,CreateSignUpPage, LoginUser, LogoutUser} = require("../controllers/User.js");

router.get("/signup",SignUpPage)

router.post("/signup",wrapAsync(CreateSignUpPage))


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,  passport.authenticate('local', { failureRedirect: '/login' , failureFlash:true}), LoginUser)

router.get("/logout",LogoutUser)
module.exports = router;