
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const db = require("./db.js");
const { required } = require("joi");

const UserSchema = new Schema({
   email:{
    type:String,
    required: true
   },
   
  });

  UserSchema.plugin(passportLocalMongoose);
  const User = mongoose.model('User', UserSchema);
 module.exports = User;