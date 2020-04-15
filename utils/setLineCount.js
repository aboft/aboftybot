require('log-timestamp')
require('dotenv').config()
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
    }
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


const setLineCount = async (channel) => {
    const createChannelCount = await knex('line_counts').insert({ channel, count: 1, dateCreated: formatDate(new Date()), lastModified: null })
    console.log(`CREATED NEW ENTRY IN DB FOR ${channel} ON ${formatDate(new Date())}`)
};

const updateLineCount = async (channel) => {
    let channelExists = await knex('line_counts').where({ channel: '#linuxmasterrace', dateCreated: formatDate(new Date()) }).select('channel')
    if (channelExists.length < 1) {
        console.log(`${channel} NOT FOUND IN DB. CREATING NEW ENTRY FOR ${channel} ON ${formatDate(new Date())}`)
        setLineCount(channel)
    }
    else {
        await knex('line_counts').where({channel: '#linuxmasterrace', dateCreated: formatDate(new Date())}).increment('count', 1)
        console.log(`UPDATING LINE COUNT FOR ${channel} ON ${formatDate(new Date())}`)
    }
}

const getLineCount = async (channel, dateCreated) => {
    dateCreated ? dateCreated = formatDate(dateCreated) : dateCreated = formatDate(new Date())
    const lineCount = await knex('line_counts').where({ channel, dateCreated }).select('count')
    if (lineCount.length < 1) {
        return `Unable to find lines said for date: ${dateCreated || 'Invalid Date'}.`
    } else {
        return `There were ${lineCount[0]["count"]} lines said on ${dateCreated}`
    }
}

module.exports = {
    setLineCount,
    getLineCount,
    updateLineCount
}