// This file defines the schema for the listing model using Mongoose.
// It specifies the structure of the listing documents in the MongoDB database.
const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { url } = require("inspector");
const { types } = require("joi");

const listingSchema = new Schema({
    //yaha par title ka property hai jo ki string hai aur required hai
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
            filename: String,
            url : {
                type: String,
                default: "https://images.unsplash.com/photo-1744522184450-77b96718b074?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D",
            },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing) => {
    if (listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }

});


//listing mongoose me jaakar ek new collection create karega listings name se
const listing = mongoose.model("listing", listingSchema);
//Exporting the listing model to use it in other files
module.exports = listing;
