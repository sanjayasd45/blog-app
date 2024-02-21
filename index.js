require('dotenv').config()
const express = require('express');
const mongoose = require("mongoose");
const {Post} = require('./models/post.js')
const {Review} = require("./models/review.js")
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError.js')
const wrapAsync = require('./utils/asyncWrap.js');
const cors = require('cors');
const methodOverride = require('method-override')
const session = require("express-session");
const flash = require("connect-flash")
const passport = require("passport")
const passportLocal = require("passport-local")
const User = require("./models/user.js")
const userRouter = require("./routers/user.js")
const {isLogedIn} = require("./middlewares/new.js")
const password = encodeURIComponent(process.env.PASSWORD)

const port = '4040';

const app = express();

mongoose.connect(`mongodb+srv://sanjayasd45:${password}@datacluster.lgoji1f.mongodb.net/testing-blog?retryWrites=true&w=majority`)
.then(() => app.listen(port, () => console.log('DB connected, and Server is running app port number ',port)))
.catch((e) => {
    console.log(e);
})

let sessionOpt = {
    secret: "This-is-super-secret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 100,
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: true,
    }
}

app.use(flash())
app.use(session(sessionOpt))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(cors())
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.set("view engine", 'ejs')
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.urlencoded({extended:true}))


app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

app.use("/user", userRouter)

app.get('/', wrapAsync(async(req, res) => {
    const postData = await Post.find();
    res.render('pages/index.ejs', {postData})
}));

app.get('/post/:id', wrapAsync(async(req, res) => {
    const {id} = req.params
    const postData = await Post.findById(id).populate("reviews");
    if(!postData){
        req.flash("error", "Post is deleted")
        res.redirect('/')
    }
    res.render('pages/show.ejs', {postData})
}));
app.get('/add', isLogedIn ,(req, res, next) => {
    res.render('pages/add.ejs')
});
app.post('/add', wrapAsync(async (req, res) => {
    let data = {...req.body, date: new Date()}
    const newPost = new Post(data); 
    newPost.save()
    req.flash("success", "New post added")
    res.redirect('/');
}));

app.delete('/post/:id', wrapAsync(async(req, res) => {
    let { id } = req.params;
    console.log(id);
    let deletedListing = await Post.findByIdAndDelete(id);
    req.flash("success", "Post deleted")
    res.redirect("/");
}));
app.get('/post/:id/edit', wrapAsync(async(req,res) => {
    let {id} = req.params
    let data = await Post.findById(id)
    if(!data){
        req.flash("error", "Post is deleted")
        res.redirect('/')
    }
    res.render("pages/edit.ejs", {data})
}))
app.put('/post/:id/edit', wrapAsync(async(req, res) => {
    const postData = {...req.body, date: new Date()}
    const {id} = req.params
    await Post.findByIdAndUpdate(id, postData)
    req.flash("success", "Post updated")
    res.redirect(`/post/${id}`)
}))
app.post('/review/:id', wrapAsync(async(req, res) => {
    const {id} = req.params;
    const post = await Post.findById(id)
    const newReview = new Review(req.body);
    post.reviews.push(newReview)
    await newReview.save()
    await post.save()
    req.flash("success", "Review Added")
    res.redirect(`/post/${id}`)
}))
app.delete('/post/:id/review/:reviewId', wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Post.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    req.flash("success", "Review deleted")
    res.redirect(`/post/${id}`)
}))


app.all("*", (req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next) => {
    let { statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("pages/error.ejs", {message});
});
