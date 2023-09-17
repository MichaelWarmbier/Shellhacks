const axios = require('axios');

const apiUrl = 'https://en.wikipedia.org/w/api.php';

async function SearchWiki(query, limit=10) {
    try {        
        const response = await axios.get(apiUrl, {
            params: {
                action: 'query',
                format: 'json',
                list: 'search',
                srsearch: query,
                srlimit: limit,
                prop: 'info',
                inprop: 'url',
            }
        });

        const searchResults = response.data.query.search;

        let returnList = [];

        for (const result of searchResults) {
            const { pageid, title } = result;
            
            const fullurl = getWikipediaLink(pageid);
      
            returnList.push({URL: fullurl, name: title});
        }

        return returnList;

    } catch (error) {
        console.error('Error:', error.message);
    }
}

function getWikipediaLink(pageId) {
    const baseWikipediaUrl = 'https://en.wikipedia.org/?curid=';
    return `${baseWikipediaUrl}${pageId}`;
}

module.exports = {
    SearchWiki: (keyword, limit) => SearchWiki(keyword, limit)
}