const mongoose = require("mongoose");
// const {Review} =  require("./review.js"); 
let Schema = mongoose.Schema

const postSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    img:{
        type:String,
        default:'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review" 
        }
    ]
})

const Post = mongoose.model("Post", postSchema)
module.exports = {Post};