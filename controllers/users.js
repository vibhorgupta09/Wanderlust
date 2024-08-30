const User=require('../models/user.js');

module.exports.signup=async(req,res)=>{
    try {
        let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to wanderlust");
    console.log(res.locals.redirectUrl);
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};