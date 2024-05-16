require('dotenv').config()


const express = require("express");
const app = express();
const mongoose = require("mongoose");
let port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo'); //mongo store require
const flash = require('connect-flash');
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");



// let MOngo_url = "mongodb://127.0.0.1:27017/land";
let atlas_Url = process.env.Atlast_url;

 const store = MongoStore.create({
  mongoUrl: atlas_Url,
 crypto : {
  secret :  'keyboard cat', 
 },
 touchAfter : 24*3600,
 })
store.on("error" , () => {
    console.log("ERROR ION STORE ON SESSION");
}) ;

const sessionOPtion = {
  store,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 1000,
    maxAge:  7 * 24 * 60 * 1000,
    httpOnly:true ,
  }
}



const listingRoute = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")



main()
  .then((res) => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(atlas_Url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionOPtion));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use( new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res , next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});



//always route ar aga flsh gulo use haba , cause we use that flash in routes
app.use("/listings" , listingRoute);
app.use("/listings/:id/review" , reviewsRouter);
app.use("/" , userRouter);



app.use((err, req, res, next) => {
  let { statuscode = 500, message = "page not exist" } = err;
  res.status(statuscode).render("error.ejs", { err });
  // Remove the next() call as you've already sent the response
});


app.listen(port, () => {
  console.log("port listen on 8080");
});
