const mongoose = require('mongoose');

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on('connected',()=>{
    console.log("mongoDb connected successfully");
})

connection.on('error', ()=>{
    console.log("mongoDb connection failed");
})

module.exports = connection