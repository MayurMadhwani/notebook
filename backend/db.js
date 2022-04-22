const mongoose = require('mongoose');
const mongURI = "mongodb://localhost:27017/notebook";

const connetToMongo = async()=>{

    mongoose.connect(mongURI,()=>{
        console.log("Connected to mongoose");
    });

}

module.exports = connetToMongo;