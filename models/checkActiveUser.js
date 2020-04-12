const mongoose = require('mongoose')
require('dotenv')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const activeUserSchema = new mongoose.Schema({
    user: {type: String, unique: true},
    message: String,
    created: { type: Date, default: Date.now }
})

module.exports = mongoose.model("activeUser", activeUserSchema)