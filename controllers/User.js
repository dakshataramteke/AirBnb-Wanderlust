const User = require("../models/User.js");

const SignUpPage = (req,res)=>{
    res.render("users/signup.ejs");
}
const CreateSignUpPage = async(req,res)=>{
    try{
        let {username , email, password } = req.body;
 const newUser=  new User({
     username,email
   
    });
  const registeredUser = await User.register(newUser,password);
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
    if(err){
        return next(err)
    }
    req.flash("success","Welcome to wanderlust ");
    res.redirect("/listings");
   
  })
 
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
  
}

const LoginUser =async(req,res)=>{
    req.flash("success","Welcome to wanderlust  you logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
   }


   const LogoutUser = (req,res)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listings");
    });
}
module.exports = {SignUpPage,CreateSignUpPage, LoginUser, LogoutUser};