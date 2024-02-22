const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const passport = require("passport")
const { saveRedirectUrl } = require("../middlewares/new.js")

router.get("/singup", (req, res) => {
    res.render("users/singup.ejs")
})
router.post("/singup", async(req, res, next) => {
    try{
        let {email, username, password} = req.body
        let newUser = new User({email, username})
        const registeredUser =  await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if(err){
                return next()
            }
            req.flash("success", "welcome to the blog")
            res.redirect("/")
        })
    }catch(e){
        req.flash("error", e.message)
        res.redirect('/singup')
    }
})

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/user/login', 
        failureFlash: true
        }), 
    async (req, res) => {
            req.flash("success", "welcome back to the blog")
            let path = res.locals.redirectUrl || "/"
            res.redirect(path)
    }
)

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err){
          return next(err)
        }
        req.flash("success", "logout successfull")
        res.redirect("/")
    })
})
module.exports = router