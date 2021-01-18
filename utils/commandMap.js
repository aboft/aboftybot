const cobol = require("./cobol.js");
const getCovidCases = require("./getCovidCases");
const { getLineCount, getMaxLines } = require("./setLineCount");
const { checkUserActive } = require("./getActiveUsers");
const {
  createInsult,
  selectRandomInsult,
  deleteInsult,
  showOwnedInsults,
  findInsult,
} = require("./gtfb");
const uptime = new Date();

// initialize map object for commands
let map = new Map([
  [
    ".testmedaddy",
    (from, to, text) =>
      `${text.split(" ")[1] || from}, I stg I'll tie you down...`,
  ],
  [
    ".cough",
    (from, to, text) =>
      `${text.split(" ")[1] || from} Get 6 feet back, you fucking heathen...`,
  ],
  [
    ".gnulag",
    (from, to, text) =>
      `${
        text.split(" ")[1] || from
      }, learn to spell gulag correctly, you pleb!`,
  ],
  [
    ".alacritty",
    (from, to, text) =>
      `${
        text.split(" ")[1] || from
      }, wtf is alacritty? All I know is I got alldemtitties.`,
  ],
  [
    ".cobol",
    (from, to, text) =>
      `(${text.split(" ")[1] || from}) ${
        cobol[Math.floor(Math.random() * cobol.length)]
      }`,
  ],
  [
    ".covid",
    async (from, to, text) => {
      const covidCases = await getCovidCases(
        text.split(" ").slice(1).join(" ")
      );
      return `${from}, ${covidCases}`;
    },
  ],
  [
    ".lines",
    async (from, to, text) => {
      const numOfLines = await getLineCount(to, text.slice(7));
      return `(${from}), ${numOfLines}`;
    },
  ],
  [
    ".topl",
    async (from, to, text) => {
      const maxCount = await getMaxLines(to);
      return `(${from}), ${maxCount}`;
    },
  ],
  [
    ".active",
    async (from, to, text) => {
      const isActive = await checkUserActive(text.slice(8));
      return `(${from}), ${isActive}`;
    },
  ],
  [
    ".uptime",
    (from, to, text) => {
      const botUptime = (new Date() - uptime) / 1000;
      const days = Math.floor(botUptime / 60 / 60 / 24);
      const hours = Math.floor((botUptime / 60 / 60) % 24);
      const minutes = Math.floor((botUptime / 60) % 60);
      const sec = Math.floor((botUptime % 60) % 60);
      return `(${from}), I've been running since ${uptime.toLocaleString()} (${days} days, ${hours} hours, ${minutes} minutes, and ${sec} seconds).`;
    },
  ],
  [
    ".gtfb",
    async (from, to, text) => {
      if (text.split(" ")[1] == "aboftybot") {
        return `(${from}), No.`;
      } else {
        if (parseInt(text.split(" ")[2])) {
          const insult = await selectRandomInsult(parseInt(text.split(" ")[2]));
          return `(${text.split(" ")[1] || from}), ${insult}`;
        } else {
          const insult = await selectRandomInsult();
          return `(${text.split(" ")[1] || from}), ${insult}`;
        }
      }
    },
  ],
  [
    ".addgtfb",
    async (from, to, text) => {
      const newInsult = text.split(" ").slice(1).join(" ");
      const addedInsult = await createInsult(from, newInsult);
      return `(${from}), ${addedInsult}`;
    },
  ],
  [
    ".delgtfb",
    async (from, to, text) => {
      const id = text.split(" ")[1];
      const isDeleted = await deleteInsult(from, id);
      return `(${from}), ${isDeleted}`;
    },
  ],
  [
    ".showgtfb",
    async (from, to, text) => {
      const gtfbId = await showOwnedInsults(from);
      return `(${from}), ${gtfbId.length !== 1 ? "IDs" : "ID"}: ${gtfbId}`;
    },
  ],
  [
    ".idgtfb",
    async (from, to, text) => {
      const insultById = await findInsult(text.split(" ")[1]);
      return `(${from}), ${insultById}`;
    },
  ],
  [
    ".shrug",
    (from, to, text) => {
      return "¯\\_(ツ)_/¯";
    },
  ],
  [
    ".hug",
    (from, to, text) => {
      return `${text.split(" ")[1] || from}, (っ◕‿◕)っ`;
    },
  ],
]);

module.exports = map;
