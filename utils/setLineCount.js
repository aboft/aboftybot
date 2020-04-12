const LineCount = require('../models/lineCount')
require('log-timestamp')

const setLineCount = async () => {
    const dateCreated = new Date().toDateString().slice(4)
    LineCount.create({dateCreated}, (err, data) => {
        if (err) console.log(err)
        else console.log(data) && data.save()
    })
}

const updateLineCount = async () => {
    const dateCreated = new Date().toDateString().slice(4)
    const lineCountExists = await LineCount.find({dateCreated})
    if (!lineCountExists) {
        setLineCount()
        return
    }
    await LineCount.findOneAndUpdate({dateCreated}, {$inc: {lineCount: 1} }, (err, data) => {
        if (err) console.log('AN ERROR OCCURED UPDATING LINE COUNT:\n', err)
        else console.log(`UPDATING LINE COUNT FOR ${dateCreated}`, data) && data.save()
    })
}

const getLineCount = async (dateCreated = new Date().toDateString().slice(4)) => {
    dateCreated = new Date(dateCreated).toDateString().slice(4)
    console.log(dateCreated)
    if (dateCreated == 'lid Date') {
        return `Invalid date format. Please use (MM/DD/YYYY | MM DD YYYY | MM-DD-YYYY | YYYY-MM-DD).`
    }
    const numberOfLines = await LineCount.find({dateCreated})
        .then(num => {
            return num
        })
        .catch(err => {
            console.log('ERROR FINDING NUMBER OF LINES IN DB:\n', err)
        })
    if (numberOfLines) { 
        return `There have been ${numberOfLines.lineCount} lines said on ${numberOfLines.dateCreated}.`
    } else {
        return `Unable to find amount of lines said. Ping aboft to fix me, I'm dying.`
    }
}

module.exports = {
    getLineCount,
    setLineCount,
    updateLineCount
}