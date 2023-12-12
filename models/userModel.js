const mongoose = require('mongoose');

mongoose.connect("mongodb://0.0.0.0:27017/probank")
    .then(()=>{console.log("connection established with db ")})
    .catch((e)=>{console.error(e.message)})

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
         type: String, 
        required: true 
    },
    isAdmin:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model("user",userSchema);