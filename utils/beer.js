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

const createBeer = async (user, beer) => {
    console.log(`CREATING BEER: ${beer} IN aboftybot.beers TABLE FOR ${user}`)
    await knex('beers').insert({id: 'null', beer, createdBy: user, dateCreated: new Date()})
}

const selectRandomBeer = async () => {
    const beer = await knex.select('beer').from('beers').orderByRaw('rand()').limit(1);
    console.log(`SUCCESSFULLY RETRIEVED ${beer[0]["beer"]} FROM aboftybot.beers`)
    return `Have a ${beer[0]["beer"]}`
}

module.exports = {
    createBeer,
    selectRandomBeer
}