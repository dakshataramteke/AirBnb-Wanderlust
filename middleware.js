const Listing = require("./models/listing.js");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log("user logged in",req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listings ");
        res.redirect("/login");
    }
    else{
        next()
    }
}

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = (req,res,next)=>{
    let {id} = req.params;
    let listing = Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUser._id)){
        req.flash("error","You don't have permission to edit !");
        return res.redirect(`/listings/${id}`);
    }
}