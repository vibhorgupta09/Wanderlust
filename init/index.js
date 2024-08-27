const mongoose = require('mongoose');
const Listing=require('../models/listing.js');
const initData = require("./data.js");

main()
.then(()=>{
    console.log("successful connection to DB");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
      ...obj,
      owner:"66cda975e45b985d4f8bb05e"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  };
  
initDB();