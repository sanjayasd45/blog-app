const express = require('express');
const password = encodeURIComponent("@123railwaY");
const mongoose = require("mongoose");
const {Post} = require('./models/post.js')
const port = '4044';

const app = express();

mongoose.connect(`mongodb+srv://sanjayasd45:${password}@datacluster.lgoji1f.mongodb.net/testing-blog?retryWrites=true&w=majority`)
    .then(() => app.listen(port, () => console.log('DB connected, and Server is running app port number ', port)))
    .catch((e) => {
        console.log(e);
    })


    let post = [
        {
            title: 'this is title 3',
            content: 'This is content 3',
            author: 'sanjay',
            date: new Date()
        },{
            title: 'this is title 4',
            content: 'This is content 4',
            author: 'sanjay',
            date: new Date()
        }
    ]
async function add() {
    try{
        const newPost = await Post.insertMany(post)
        console.log(newPost);
    }catch(e){
        console.log(e);
    }
}
add()

// app.get('/', async(req, res) => {
//     const postData = await Post.find();
//     console.log(postData);
//     res.send("working")
// })