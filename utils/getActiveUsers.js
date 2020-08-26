require('log-timestamp')
require('dotenv').config()
const moment = require('moment')
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB,
	typeCast: function(field, next){
	    if (field.type == 'TIMESTAMP') {
	        return moment(field.string()).format('YYYY-MM-DD HH:mm:ss')
	    }
	    return next();
	}
    }
});

const checkUserActive = async (user) => {
    const userExists = await knex('active_user').where({ user }).select('message','lastModified')
    if (userExists.length < 1) {
        return `I have not seen ${user} talking in this channel.`
    }
    else {
        console.log(`RETRIEVED USER ${user} FROM active_user TABLE.`)
	const lastTalk = (new Date() - new Date(userExists[0]["lastModified"])) / 1000
	const days = Math.floor((lastTalk / 60) / 60 / 24)
	const hours = Math.floor((lastTalk / 60 / 60) % 24)
	const minutes = Math.floor((lastTalk / 60) % 60)
	const sec = Math.floor((lastTalk % 60) % 60)
        if (days > 0) {
	    return `${user} was last seen talking ${days} day(s) and ${hours} hour(s) ago saying "${userExists[0]["message"]}"`
	} else if (hours > 0) {
	    return `${user} was last seen talking ${hours} hour(s) and ${minutes} minute(s) ago saying "${userExists[0]["message"]}"`
	} else {
	    return `${user} was last seen talking ${minutes} minute(s) and ${sec} second(s) ago saying "${userExists[0]["message"]}"`
	}
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
