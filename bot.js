const irc = require('irc')
const jokes = require('./utils/jokes.js')
const cobol = require('./utils/cobol.js')
const gtfb = require('./utils/gtfb')
const getCovidCases = require('./utils/getCovidCases')
const { getLineCount, updateLineCount } = require('./utils/setLineCount')
const { updateActiveUserMessage, checkUserActive } = require('./utils/getActiveUsers')
const { createBeer, selectRandomBeer } = require('./utils/beer');
const inStock = require('./utils/zephyrus')

require('dotenv').config()
require('log-timestamp')(function () { return `[${new Date().toLocaleString()}] ` })

// Create the configuration
var config = {
    channels: ["#aboftytest", '#linuxmasterrace'],
    server: "irc.snoonet.net",
    botName: "aboftybot",
    realName: 'Aboft\'s Node Bot',
    userName: 'aboftybot',
    autoConnect: false,
    password: process.env.PASSWORD,
    options: { sasl: true },
    //floodProtection: true,
    //floodProtectionDelay: 1700,
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
    if (from == 'gonzobot' && text.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '').search(/<.quack|<.flap/) > 0){
        console.log(text.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '').search(/quack|flap/))
        console.log(text)
        setTimeout(() => {
            bot.say(to, '.bef')
        },1100)
    }
    text = text.trim()
    // this references to the first word in each sentence
    switch (text.split(' ')[0]) {
        case '.nick':
            if (from == 'aboft') {
                if (text.split(' ')[1] == 'aboftybot') {
                    bot.send("NICK", `${'aboftybot'}`)
                    bot.send("PRIVMSG", "nickserv", "identify", "b0t4d4yz")
                    console.log("NICK", `${text.split(' ')[1] || 'aboftybot'}`)
                    break
                }
                else {
                    bot.send("NICK", `${text.split(' ')[1]}`)
                    break
                }
            }
            break
        case '.testmedaddy':
            bot.say(to, `${text.split(" ")[1] || from}, I stg I'll tie you down...`)
            break
        case '.cough':
            bot.say(to, `${text.split(' ')[1] || from} Get 6 feet back, you fucking heathen...`)
            break
        case '.gnulag':
            bot.say(to, `${text.split(' ')[1] || from}, learn to spell gulag correctly, you pleb!`)
            break
        case '.alacritty':
            bot.say(to, `${text.split(' ')[1] || from}, wtf is alacritty? All I know is I got alldemtitties.`)
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
            const hours = Math.floor((botUptime / 60 / 60) % 24)
            const minutes = Math.floor((botUptime / 60) % 60)
            const sec = Math.floor((botUptime % 60) % 60)
            bot.say(to, `(${from}), I've been running since ${uptime.toLocaleString()} (${days} days, ${hours} hours, ${minutes} minutes, and ${sec} seconds).`)
            break;
        case '.cobol':
            // this used to be zephyrus command to check in stock for G14 Zephyrus AMD Ryzen 9
            //const isInStock = await inStock();
            //bot.say(to, `(${from}), I heard you're learning COBOL! If you want to learn more type "/msg unixbird teach me cobol pl0x"!`);
            bot.say(to, `(${text.split(' ')[1] || from}) ${cobol[Math.floor(Math.random() * cobol.length)]}`)
            break
        case '.beer':
            const beer = await selectRandomBeer();
            bot.say(to, `(${text.split(' ')[1] || from}), ${beer}`);
            break
        case '.addbeer':
            const newBeer = text.split(" ").slice(1).join(" ");
            await createBeer(from, newBeer);
            bot.say(to, `Created new beer: ${newBeer}`)
            break;
    }
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

