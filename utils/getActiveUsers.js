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

const checkUserActive = async (user) => {
    const userExists = await knex('active_user').where({ user }).select('message','lastModified')
    if (userExists.length < 1) {
        createActiveUser(user)
        return `I have not seen ${user} talking in this channel.`
    }
    else {
        console.log(`RETRIEVED USER ${user} FROM active_user TABLE.`)
        return `${user} was last seen talking on ${userExists[0]["lastModified"]} saying "${userExists[0]["message"]}"`
    }
}

const createActiveUser = async (user, message) => {
    console.log(`CREATING USER IN active_user TABLE FOR ${user}`)
    await knex('active_user').insert({user, message, dateCreated: new Date(), lastModified: new Date()})
}

const updateActiveUserMessage = async (user, message) => {
    const isUserActive = checkUserActive(user)
    if (isUserActive.length < 1) {
        createActiveUser(user)
        return
    }
    console.log(`UPDATING MESSAGE FOR USER ${user} IN active_user TABLE`)
    await knex('active_user').where({user}).update({message})
}

module.exports = {
    checkUserActive,
    createActiveUser,
    updateActiveUserMessage
}