const axios = require("axios");
const $ = require("cheerio");

const getCovidCases = async (region) => {
  if (region.split(" ").length > 1) {
    return `Unable to find ${region}.`;
  }
  let covidUrl;
  // verify not any extra spaces will break logic or search
  region.trim().toLowerCase() == "" ? (region = "Total") : region;
  // set url to search by either country or all
  region == "Total"
    ? (covidUrl =
        "https://www.worldometers.info/coronavirus/?utm_campaign=homeAdvegas1?")
    : (covidUrl = `https://www.worldometers.info/coronavirus/country/${region
        .split(" ")
        .join("-")}/`);
  console.log("Attempting to fetch COVID-19 cases URL: ", covidUrl);
  const covidCounts = await axios.get(covidUrl).then((res) => {
    let covidCases = [];
    if (res.request.path == "/404.shtml") {
      return (covidCases = []);
    }
    // we are looking for only 3 fields - cases, confirmed, deaths
    for (let i = 0; i < 3; i++) {
      covidCases.push(
        $(".maincounter-number > span", res.data)[i].children[0].data.trim()
      );
    }
    // return array of numbers for values above of confirmed, deaths, and cases
    return covidCases;
  });
  if (covidCounts.length < 3) {
    return `Unable to find ${region}.`;
  }
  return `(${region}) - Confirmed Cases: ${covidCounts[0]}  Deaths: ${covidCounts[1]}   Recovered: ${covidCounts[2]}`;
};

module.exports = getCovidCases;
