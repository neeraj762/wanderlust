// if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
  console.log(process.env.ATLAS_DB_URL,'000',process.env.CLOUD_NAME)
// }


const express = require('express')
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync')
const ExpressError = require('./utils/ExpressError');
const {listingSchema,reviewSchema}  = require('./schema.js');
const Review = require('./models/review');
const User = require("./models/user.js")
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')


const passport = require("passport");
const LocalStrategy = require("passport-local");

const dbUrl = process.env.ATLAS_DB_URL;

main();

async function main() {
  console.log(dbUrl)
  await mongoose.connect(dbUrl).then(res => {
    console.log('Connected to db');
  }).catch(err => {
    console.log(err);
  })
}


const PORT = 8080;

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")))


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600
})

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie :{
    expires : Date.now() + 7*24*60*60*1000,
    maxAge :  7*24*60*60*1000,
    httpOnly : true
  }
}

// Root route
// app.get('/', (req, res) => {
//   res.send('hi wanderlust');
// })




app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.get("/demouser",async (req,res)=>{
  let fakeUser = new User({
    email :"user1@gmail.com",
    username :"user1"
  })

  const registerUser = await User.register(fakeUser,"helloworld");
  res.send(registerUser);

})

app.use("/",userRouter)
app.use("/listing",listingRouter)
app.use("/listing/:id/reviews",reviewRouter)



app.all('*',(req,res,next) =>
{
  next(new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
  let {statusCode=500 , message="Something went wrong"} = err;
  res.status(statusCode).render("listing/error.ejs",{message})
// res.status(statusCode).send(message);
})

app.listen(PORT, () => {
  console.log('Server is running at 8080')
})