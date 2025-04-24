const Listing = require("../models/listing.js");

const Index = async(req,res)=>{
    const allListings = await Listing.find({})
     res.render("listings/index.ejs", {allListings});
 }

const EditListing = async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}

const NewListing = (req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
}

const CreateListing = async(req,res,next)=>{
   let url= req.file.path;
   let filename = req.file.filename;
   console.log("URL :",url, "Filename :",filename);
    const newListings = new Listing(req.body.listing);  
    newListings.owner = req.user._id; 
    newListings.image = {url,filename};
    console.log(req.user);
    await newListings.save();
    req.flash("success","New Listing Created !");
    res.redirect("listings");
}

const UpdateListing = async(req,res)=>{
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated !");
    res.redirect(`${id}`);
}

const DeleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !");
   res.redirect("listings");
}

const ShowListing = async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("review").populate("owner");
 //    console.log(listing);
    if(!listing){
     req.flash("error","Listing Not Found");
     res.redirect(`/listings`);
    }
    res.render("listings/show.ejs",{listing});
 }
 module.exports = {Index, EditListing, NewListing , CreateListing, UpdateListing,DeleteListing,ShowListing};