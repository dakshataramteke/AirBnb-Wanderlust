const express = require('express');
const db = require("./models/db.js");
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require("path");
const app = express();
const port = 8000;


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public/css')))
app.get("/", (req,res)=>{
res.send("Welcome to Airbnb")
})

//Index Route
app.get("/listings",async(req,res)=>{
   const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Create Route
app.post("/listings",async(req,res)=>{
  
    const newListings = new Listing(req.body.listing);
   await newListings.save();
   res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);

   res.redirect("/listings");
})
//Show Route
app.get("/listings/:id",async(req,res)=>{
   let {id} = req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show.ejs",{listing});
})
app.listen(port,()=>{
    console.log("Server is listing on port", port);
})