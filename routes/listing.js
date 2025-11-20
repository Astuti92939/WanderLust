const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

function validateListing(req, res, next) {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid data: 'listing' is required");
    }
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}


//Index route
router.get("/",wrapasync (async(req, res) => {
    //Finding all listings from database
    const allListing = await listing.find({});
    res.render("listings/index.ejs", {allListing});
    // console.log(allListing);
}));

//New route
router.get("/new",isLoggedIn,((req,res) => {
    res.render("listings/new.ejs");
}));


//Create route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapasync(async (req,res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Data")
    // }
    //Jab form se req aa raha hai tab usko yaha pe nikal ke save kara rahe hai
    const newListing = new listing(req.body.listing);
    // if(!newListing.title){
    //     throw new ExpressError(400,"Send Valid Data")
    // }
    //Jab tak newListing save nahi hota tab tk wait karo
    await newListing.save();
    req.flash("success", "New listing Created!!");
    //Redirect to listings 
    res.redirect("/listings");
}));



//Show listing route
router.get("/:id", wrapasync(async (req, res) => {
    const id = req.params.id;
    const listingData = await listing.findById(id).populate("reviews");
    if (!listingData) {
        req.flash("error", "Page Not Found");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listingData });
}));


//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    wrapasync (async(req,res) =>{
    const id = req.params.id;
    const listingData = await listing.findById(id);
    res.render("listings/edit.ejs", {listingData} );
    console.log(listingData);
}));

//Update Route
router.put("/:id", isLoggedIn,validateListing, wrapasync(async (req, res) => {
    let { id } = req.params;
    const updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Updated!!");
    res.redirect("/listings");
}));

//Destroy Route
router.delete("/:id",isLoggedIn, wrapasync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new (404, "Listing not found");
    }
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
}));

module.exports = router;