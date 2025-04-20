const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const db = require("../models/db");

const initDB  = async ()=>{
  await  Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner: '6801d7d531adbc7a77feb5b6'}))
  await Listing.insertMany(initData.data);
  console.log("Data initalize");
}
initDB();