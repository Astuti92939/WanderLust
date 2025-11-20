const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const initData = require("./data.js");
const listing = require("../models/listing.js");

//Connecting to MongoDB
const MongoDB_url = 'mongodb://127.0.0.1:27017/wanderlust';

async function main(){
    await mongoose.connect(MongoDB_url);
}

main()
.then(() => {
    console.log("connected to mongodb");
    initDB();
})
.catch((err) => {
    console.log(err);
});

//Initalize data
const initDB = async() => {
    try {
        //Deleting existing data
        await listing.deleteMany({});
        //Inserting new data
        await listing.insertMany(initData.data);
        console.log(initData.data);
    } catch (err) {
        console.error("Error initializing data:", err);
    }
}

initDB()
.then(() => {
    console.log("Database initialized successfully");
})
.catch((err) => {
    console.error("Error initializing database:", err);
})