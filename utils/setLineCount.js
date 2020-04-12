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
    if (lineCountExists.length < 1) {
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
    if (dateCreated == 'lid Date') {
        return `Invalid date format. Please use (MM/DD/YYYY | MM DD YYYY | MM-DD-YYYY | YYYY-MM-DD).`
    }
    const numberOfLines = await LineCount.find({dateCreated}, (err, lines) => {
        if (err) {
            console.log('ERROR RETRIEVING LINES FROM DB:\n', err)
            return `Unable to find amount of lines said. Ping aboft to fix me, I'm dying.`
        }
        else {
            return `There have been ${lines.lineCount} lines said on ${lines.dateCreated}.`
        }
    })
    return numberOfLines
}

module.exports = {
    getLineCount,
    setLineCount,
    updateLineCount
}