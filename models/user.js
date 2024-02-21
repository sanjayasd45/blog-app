const passportLM = require('passport-local-mongoose')
const mongoose = require('mongoose')
const Schema = mongoose.Schema



const userShema = new Schema({
    email:{
        type:String,
        required: true
    }
});

userShema.plugin(passportLM)
module.exports = mongoose.model("User", userShema) 


