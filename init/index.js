const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const db = require("../models/db");

const initDB  = async ()=>{
  await  Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data initalize");
}
initDB();