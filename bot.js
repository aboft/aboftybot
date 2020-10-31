const irc = require("irc");
const map = require("./utils/commandMap");
const { selectRandomInsult } = require("./utils/gtfb");
const { updateLineCount, checkLineCount } = require("./utils/setLineCount");
const { updateActiveUserMessage } = require("./utils/getActiveUsers");
require("dotenv").config();
require("log-timestamp")(function () {
  return `[${new Date().toLocaleString()}] `;
});

map.set(".nick", async (from, to, text) => {
  if (from == "aboft") {
    if (text.split(" ")[1] == "aboftybot") {
      bot.send("NICK", `${"aboftybot"}`);
      bot.send("PRIVMSG", "nickserv", "identify", process.env.PASSWORD);
      console.log("NICK", `${text.split(" ")[1] || "aboftybot"}`);
    } else bot.send("NICK", `${text.split(" ")[1]}`);
  }
});

// Create the configuration
var config = {
  channels: ["#aboftytest", "#linuxmasterrace"],
  server: "irc.snoonet.net",
  botName: "aboftybot",
  realName: "aboftybot",
  userName: "aboftybot",
  autoConnect: false,
  password: process.env.PASSWORD,
  options: { sasl: true },
  //floodProtection: true,
  //floodProtectionDelay: 1700,
};

var bot = new irc.Client(config.server, config.botName, config);

console.log("=================================================");
console.log(" ");
console.log("		        BOOTING ABOFTYBOT		      ");
console.log(" ");
console.log("=================================================");
bot.connect();

// make a starting time when bot is connecting
let bufferTime = Date.now();

bot.addListener("message", async function (from, to, text, message) {
  // return if any messages are within 15 seconds from connecting
  // this way we can prevent spams on join
  if (Date.now() - bufferTime < 20000) {
    return;
  }
  // bitch at people for stealing me duccs
  if (
    from == "gonzobot" &&
    text.toLowerCase().search(/befriended a duck|shot a duck/) > 0 &&
    text.split(" ")[0] !== "aboft"
  ) {
    const duccStealer = text.split(" ")[0];
    console.log(`${duccStealer} stole your ducc!`);
    const insult = await selectRandomInsult();
    setTimeout(() => {
      bot.say(to, `(${duccStealer}), ${insult}`);
    }, 500);
  }
  text = text.trim();
  let command = text.split(" ")[0];
  if (map.has(command)) {
    const commandOutput = await map.get(command)(from, to, text);
    bot.say(to, commandOutput);
  }
  await updateLineCount(to);
  await updateActiveUserMessage(from.toLowerCase(), text);
  const numberOfLines = await checkLineCount(to);
  if (parseInt(numberOfLines) >= 1000 && parseInt(numberOfLines) % 500 == 0)
    bot.say(to, `Woo! We hit ${numberOfLines} lines so far, today!`);
});

bot.addListener("kick", function (channel, nick, by, reason) {
  if (nick != "aboftybot") {
    return;
  }
  console.log(`Kicked from ${channel} by ${by} for ${reason}`);
  setTimeout(() => {
    console.log(
      `ATTEMPTING TO JOIN ${channel} -- bot.send("JOIN", ${channel}) `
    );
    bot.send("JOIN", `${channel}`);
    bufferTime = Date.now();
  }, 62000);
});

bot.addListener("error", function (message) {
  console.log("ERROR CRASHING DUE TO: \n ", message);
});

bot.addListener("join", function (to, nick) {
  if (nick == "aboftybot") {
    console.log(`${nick} HAS CONNECTED TO ${to}`);
  }
});
