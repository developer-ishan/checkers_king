var mongoose = require('mongoose')
const keys = require('./keys')

// Connecting to Mongo Atlas with its Connection String
const connectDB = mongoose.connect(keys.MONGO_URI);

connectDB.then((db) => {
    console.log('Connected To Database!!')
    return db
    }, (err) => {console.log(err)})

module.exports = connectDB;