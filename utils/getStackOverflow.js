const axios = require('axios')
const $ = require('cheerio')

const getStackOverflow = async (search) => {
    let stackURL = 'https://www.stackoverflow.com/';
    search = search.trim()
    if (!search || search == '') {
        console.log('`Unable to find search term ${search}.`')
        return `Unable to find search term ${search}.`
    }
    const searchTerm = search.split(' ').join('+')
    console.log(`Attempting to search for ${search}`)
    console.log(stackURL + `search?q=${searchTerm}`)
    const url = 'https://api.stackexchange.com/docs/search#order=desc&sort=activity&intitle=how%20do%20i&filter=default&site=stackoverflow&run=true'
    await axios.get(encodeURIComponent(url)).then(res => {
        console.log($('.question-hyperlink', res.data))
        console.log(res.data)
    })
}

getStackOverflow('how do i lower case js')