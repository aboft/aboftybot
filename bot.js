const irc = require('irc')
const jokes = require('./utils/jokes.js')
const gtfb = require('./utils/gtfb')
const getCovidCases = require('./utils/getCovidCases')
const { getLineCount, updateLineCount } = require('./utils/setLineCount')
const { updateActiveUserMessage, checkUserActive } = require('./utils/getActiveUsers')
require('dotenv').config()
require('log-timestamp')(function () { return `[${new Date().toLocaleString()}] ` })
// Create the configuration
var config = {
    channels: ["#aboftytest", "#linuxmasterrace"],
    server: "irc.snoonet.net",
    botName: "aboftybot",
    realName: 'Aboft\'s Node Bot',
    userName: 'aboftybot',
    autoConnect: false,
    password: process.env.PASSWORD,
    options: { sasl: true },
    floodProtection: true,
    floodProtectionDelay: 1700,
};

var bot = new irc.Client(config.server, config.botName, config);

console.log("=================================================\n")
console.log("		   BOOTING ABOFTYBOT		      \n")
console.log("=================================================\n")
const uptime = new Date()
bot.connect()



// make a starting time when bot is connecting
const bufferTime = Date.now()

bot.addListener("message", async function (from, to, text, message) {
    // return if any messages are within 15 seconds from connecting
    // this way we can prevent spams on join
    if (Date.now() - bufferTime < 15000) {
        return
    }
    // this references to the first word in each sentence
    switch (text.split(' ')[0]) {
        case '.testmedaddy':
            bot.say(to, `${text.split(" ")[1] || from}, I stg I'll tie you down...`)
            break
        case '.cough':
            bot.say(to, `${text.split(' ')[1] || from} Get 6 feet back, you fucking heathen...`)
            break
        case '.gnulag':
            bot.say(to, `${from}, learn to spell gulag correctly, you pleb!`)
            break
        case '.alacritty':
            bot.say(to, `${from}, wtf is alacritty? All I know is I got alldemtitties.`)
            break
        case '.joke':
            bot.say(to, jokes[Math.floor(Math.random() * jokes.length)])
            break
        case '.gtfb':
            bot.say(to, `(${text.split(' ')[1] || from}) ${gtfb[Math.floor(Math.random() * gtfb.length)]}`)
            break
        case '.covid':
            const covidCases = await getCovidCases(text.split(' ').slice(1).join(' '))
            bot.say(to, `${from}, ${covidCases}`)
            break
        case '.lines':
            const numOfLines = await getLineCount(to, text.slice(7))
            bot.say(to, `(${from}), ${numOfLines}`)
            break
        case '.active':
            const isActive = await checkUserActive(text.slice(8))
            bot.say(to, `(${from}), ${isActive}`)
            break;
        case '.uptime':
            const botUptime = (new Date() - uptime) / 1000
            const days = Math.floor((botUptime / 60) / 60 / 24)
            const hours = Math.floor((botUptime / 60) / 60)
            const minutes = Math.floor((botUptime / 60) % 60)
            const sec = Math.floor((botUptime % 60) % 60)
            bot.say(to, `(${from}), I've been running since ${uptime.toLocaleString()} (${days} days, ${hours} hours, ${minutes} minutes, and ${sec} seconds).`)
            break;
    }
    if (text.toLowerCase().includes('cobol')) {
        bot.say(to, `(${from}) Did you say COBOL? unixbird is an expert so you should ask him your questions.`)
    }
    updateLineCount(to)
    updateActiveUserMessage(from.toLowerCase(), text)
});


bot.addListener('error', function (message) {
    console.log("ERROR CRASHING DUE TO: \n ", message);
});

bot.addListener("join", function (to, nick) {
    if (nick == 'aboftybot') {
        console.log(`${nick} HAS CONNECTED TO ${to}`)
    } 
})

