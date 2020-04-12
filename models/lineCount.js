const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const lineCountSchema = new mongoose.Schema({
    lineCount: {type: Number, default: 1},
    dateCreated: String,
    lastModified: { type: Date, default: Date.now }
})

module.exports = mongoose.model("lineCount", lineCountSchema)