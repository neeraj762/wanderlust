const mongoose = require('mongoose');
const Listing = require('../models/listing.js')
const initData = require('./data.js')

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main();

async function main() {
 await mongoose.connect(MONGO_URL).then(res=>{
    console.log('Connected to db');
 }).catch(err=>{
    console.log(err);
 })
}

async function init() {
    await Listing.deleteMany({});
   initData.data =  initData.data.map((obj)=> ({
      ...obj,
      owner:'66221391c23736cebc604b54'
   }));
    await Listing.insertMany(initData.data);
    console.log("data saved success")
}


init();