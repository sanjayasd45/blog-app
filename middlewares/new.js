module.exports.isLogedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        console.log(req.session.redirectUrl);
        req.flash("error", "login is required for this")
        console.log(req.locals);
        return res.redirect("/user/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        req.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}