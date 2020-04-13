const irc = require('irc')
const jokes = require('./utils/jokes.js')
const gtfb = require('./utils/gtfb')
const getCovidCases = require('./utils/getCovidCases')
const ActiveUser = require('./models/checkActiveUser')
const {getLineCount, setLineCount, updateLineCount} = require('./utils/setLineCount')
require('dotenv').config()
require('log-timestamp')
// Create the configuration
var config = {
    channels: ["#aboftytest", "#linuxmasterrace" ],
    server: "irc.snoonet.net",
    botName: "aboftybot",
    realName: 'Aboft\'s Node Bot',
    userName: 'aboftybot',
    autoConnect: false,
    password: process.env.PASSWORD,
    options: { sasl: true },
    floodProtection: true,
    floodProtectionDelay: 1000,
};

var bot = new irc.Client(config.server, config.botName, config);

console.log("=================================================\n")
console.log("		   BOOTING ABOFTYBOT		      \n")
console.log("=================================================\n")

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
            const numOfLines = await getLineCount(text.slice(7))
            bot.say(to, `(${from}), ${numOfLines}`)
            break
    }
    (from.includes('bot')) ? false : updateLineCount()
});


bot.addListener('message', async function (from, to, text, message) {
    // return if any messages are within 15 seconds from connecting
    // this way we can prevent spams on join
    if (Date.now() - bufferTime < 15000) {
        return
    }
    //this references to anything starting with a period '.'
    // grab the nickname of the user
    // verify they already exist in the DB, if not it returns an empty array
    const userExists = await ActiveUser.find({ user: from })
    if (text.startsWith('.active')) {
        const isUserActive = await ActiveUser.find({ user: from }, (err, user) => {
            if (err) console.log(err)
            else return user
        })

        await (isUserActive.length > 0) ? bot.say(to, `${text.split(' ')[1]} was last seen on ${isUserActive[0].created} saying "${isUserActive[0].message}"`) : bot.say(to, `I have not seen ${text.split(' ')[1]} speak here before.`)
    }
    if (userExists.length > 0) {
        ActiveUser.findOneAndUpdate({ user: from }, { message: text }, (err, updatedMessage) => {
            err ? console.log(err) : console.log('Updated message for user\n', updatedMessage) && updatedMessage.save()
        })
    } else {
        ActiveUser.create({ user: from, message: text }, (err, createdUser) => {
            err ? console.log(err) : console.log('Created user in DB for .active command\n', createdUser) && createdUser.save()
        })
    }
})

bot.addListener('error', function(message) {
    console.log("ERROR CRASHING DUE TO: \n ", message);
});

//disabling join messages but leaving in for future use
//
// bot.addListener("join", function (to, nick) {
//     if (nick == 'aboftybot') {
//         bot.say(to, `How in the heck did I get in here?`)
//     } else {
//         bot.say(to, `Come on in, ${String(nick)}! The COVID-19 is just fine!`)
//     }
// })

