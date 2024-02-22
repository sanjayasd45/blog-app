const {Post} = require("../models/post.js")
module.exports.isLogedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "login is required for this")
        console.log(req.locals);
        return res.redirect("/user/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}
module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params
    let post = await Post.findById(id)
    if(!post.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission for this")
        return res.redirect(`/post/${id}`)
    }
    next()
}