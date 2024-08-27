const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError= require("./util/expressError.js");
const listingRouter = require('./routes/listing.js');
const reviewRouter= require('./routes/review.js');
const userRouter = require('./routes/user.js');
const passport=require("passport");
const LocalStrategy= require("passport-local");
const User=require("./models/user.js");

const session=require("express-session");
const flash=require("connect-flash");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

main()
.then(()=>{
    console.log("successful connection to DB");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const sessionOptions={
  secret:"mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// app. get ("/demouser", async (req, res) => {
//   let fakeUser = new User ({
//   email: "student@gmail.com", 
//   username: "delta-student",
//   });
  
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My sample villa",
//         description: "sample description",
//         price: 12000,
//         location:"Goa",
//         country:"India"
//     });
//     await sampleListing.save()
//     .then((res)=>{
//         console.log(res);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
//     res.send("successful testing")
// })

app.all("*",(req,res,next)=>{
  next(new expressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong!"}= err;
  res.status(statusCode).render("./listings/error.ejs",{message});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});