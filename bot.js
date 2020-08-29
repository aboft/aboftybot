const irc = require('irc')
const jokes = require('./utils/jokes.js')
const cobol = require('./utils/cobol.js')
const getCovidCases = require('./utils/getCovidCases')
const { getLineCount, updateLineCount } = require('./utils/setLineCount')
const { updateActiveUserMessage, checkUserActive, maybePluralize } = require('./utils/getActiveUsers')
const { createInsult, selectRandomInsult, deleteInsult, showOwnedInsults, findInsult } = require('./utils/gtfb');
const inStock = require('./utils/zephyrus')

require('dotenv').config()
require('log-timestamp')(function () { return `[${new Date().toLocaleString()}] ` })

// Create the configuration
var config = {
    channels: ["#aboftytest", "#linuxmasterrace" ],
    server: "irc.snoonet.net",
    botName: "aboftybot",
    realName: 'aboftybot',
    userName: 'aboftybot',
    autoConnect: false,
    password: process.env.PASSWORD,
    options: { sasl: true },
    //floodProtection: true,
    //floodProtectionDelay: 1700,
};

// Command functions
function uptimeCommand() {
    let to = arguments[0];
    let from = arguments[1];
    const botUptime = (new Date() - uptime) / 1000
    const days = Math.floor((botUptime / 60) / 60 / 24)
    const hours = Math.floor((botUptime / 60 / 60) % 24)
    const minutes = Math.floor((botUptime / 60) % 60)
    const sec = Math.floor((botUptime % 60) % 60)
    bot.say(to, `(${from}), I've been running since ${uptime.toLocaleString()} (${days} days, ${hours} hours, ${minutes} minutes, and ${sec} seconds).`)
}

function linesCommand() {
    let to = arguments[0];
    let from = arguments[1];
    const numOfLines = await getLineCount(to, text.slice(7))
    bot.say(to, `(${from}), ${numOfLines}`)
}

// Command hashmap
const commands = {
    "uptime": uptimeCommand,
    "lines": linesCommand,
    // TODO convert other switch case bodies to this
};

var bot = new irc.Client(config.server, config.botName, config);

console.log("=================================================")
console.log(" ")
console.log("		        BOOTING ABOFTYBOT		      ")
console.log(" ")
console.log("=================================================")
const uptime = new Date()
bot.connect()



// make a starting time when bot is connecting
let bufferTime = Date.now()

bot.addListener("message", async function (from, to, text, message) {
    // return if any messages are within 15 seconds from connecting
    // this way we can prevent spams on join
    if (Date.now() - bufferTime < 20000) {
        return
    }
    if (from == 'gonzobot' && text.toLowerCase().search(/befriended a duck|shot a duck/) > 0){
        const duccStealer = text.split(' ')[0]
        console.log(`${duccStealer} stole your ducc!`)
        const insult = await selectRandomInsult()
        setTimeout(() => {
            bot.say(to, `(${duccStealer}), ${insult}`)
        },500)
    }
    text = text.trim()
    // this references to the first word in each sentence

    // Execute incoming command if it exists
    let potentialCommand = text.split(' ')[0].substring(1);
    if (potentialCommand in commands) {
        commands[potentialCommand](to, from, text);
    }
    // Else maybe notice that command does not exist

    await updateLineCount(to)
    await updateActiveUserMessage(from.toLowerCase(), text)
});

bot.addListener('kick', function(channel, nick, by, reason) {
    console.log(`Kicked from ${channel} by ${by} for ${reason}`)
    setTimeout(() => {
        console.log(`ATTEMPTING TO JOIN ${channel} -- bot.send("JOIN", ${channel}) `)
        bot.send("JOIN", `${channel}`)
        bufferTime = Date.now()
    }, 62000)
})

bot.addListener('error', function (message) {
    console.log("ERROR CRASHING DUE TO: \n ", message);
});

bot.addListener("join", function (to, nick) {
    if (nick == 'aboftybot') {
        console.log(`${nick} HAS CONNECTED TO ${to}`)
    }
})

