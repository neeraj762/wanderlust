const User = require("../models/user");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=>{
    try{
     let {username,email,password} = req.body;
 
     let newUser = new User({
         email : email,
         username: username
     });
 
     let registerUser = await User.register(newUser,password);
     console.log(registerUser);
     req.login(registerUser,(err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","Welcome to Wanderlust");
         res.redirect('/listing');
     })
    
    }catch(err){
     req.flash("error",err.message)
     res.redirect('/signup')
    }
    
 }

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let newRedirectUrl = res.locals.redirectUrl || "/listing"
    res.redirect(newRedirectUrl)
    }


module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing")
    })
}