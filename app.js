//Express,Mongoose Rest API CRUD application
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//listing model ko require karna hai
const listing = require("./models/listing.js");
const  path = require("path");
const method_override = require("method-override");
const engine = require("ejs-mate");
const wrapasync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Reviews = require("./models/review.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const users = require("./routes/user.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


//Connecting to MongoDB
const MongoDB_url = 'mongodb://127.0.0.1:27017/wanderlust';

async function main(){
    await mongoose.connect(MongoDB_url);
}

main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(method_override("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs", engine);
app.use(cookieParser());


const sessionOpt = {
    secret: "my",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/register", async (req,res) => {
//     let fakeUser = new User({
//         email : "axc123@gmail.com",
//         username: "elta",
//     });

//     let registeredStudent = await User.register(fakeUser,"ByyWorld");
//     res.send(registeredStudent);
// })

app.use("/listings", listings);
app.use("/listing/:id/reviews", reviews);
app.use("/",users);


app.all("*", (req, res, next) => {
    console.log(`Route not found: ${req.originalUrl}`);
    next(new ExpressError(404, "Page Not Found!"));
});

//Error Handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went Wrong" } = err;
    res.status(status).render("error.ejs", { err });
    console.log(err);
});

//Setting port
app.listen(8080, () => {
    console.log("Port 8080 is listening");
});