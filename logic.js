const fs = require('fs')

const siteData = {
    topicFilter: [],
    diffcultyFilter: [],
    currentQuestion: {}
}

const QuestionType = {
    MultipleChoice: 0,
    OpenEnded: 1
}

const assignTopicFilter = (filter) => {
    const index = siteData.topicFilter.indexOf(filter);

    if(index !== -1){
        siteData.topicFilter.splice(index, 1);
    } else {
        siteData.topicFilter.push(filter);
    }

    console.log(siteData.topicFilter.length);
}

const assignDifficultyFilter = (filter) => {
    const index = siteData.diffcultyFilter.indexOf(filter);

    if (index !== -1)
    {
        siteData.diffcultyFilter.splice(index, 1);
    } else {
        siteData.diffcultyFilter.push(filter);
    }

    console.log(siteData.diffcultyFilter.length);
}

async function loadQuestions() {
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + '/questions.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the JSON file:', err);
                reject(err); // Reject the Promise on error
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData.Questions); // Resolve the Promise with the 'questions' data
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                reject(jsonError); // Reject the Promise on JSON parsing error
            }
        });
    });
}

const filteredQuestions = async (selectedTopics, selectedDifficulties, searchParam) => {
    let questions = await loadQuestions();

    if (selectedTopics.length === 0 && selectedDifficulties.length === 0 && searchParam.length === 0) {
        return questions;
    }

    try {
        let filtered = []
        
        if (searchParam.length > 0) {
            const regex = new RegExp(`\\b\\w*${searchParam}\\w*\\b`, 'gi');
            const matchingWords = [];

            for (question of questions) {
                for(const keyword of question.keywords)
                {
                    const words = keyword.match(regex);
                    if (words) {
                      filtered.push(question);
                    }
                }
            }
        } else {
            filtered = questions;
        }

        console.log("NO SEARCH PARAM");
        if (selectedTopics.length === 0 && selectedDifficulties.length === 0) {
            console.log("ONLY SEARCH PARAM:", filtered);

            return filtered;
        } else {
            let refilter = []
            if (selectedTopics.length > 0) console.log(`FILTERING ${selectedTopics}`);
            if (selectedDifficulties.length > 0) console.log(`${selectedDifficulties}`);

            for (question of filtered) {
                if (selectedTopics.includes(question.topic) && selectedDifficulties.includes(question.difficulty)) {
                    refilter.push(question);
                }
            }

            return refilter;
        }        
    } catch (error) {
        console.error('Error filtering questions:', error);
        throw error;
    }
}

module.exports = {
    getQuestions: async () => {
        return await loadQuestions();
    },

    getFilter: async (selectedTopics, selectedDifficulties, searchParam) => {
        return await filteredQuestions(selectedTopics, selectedDifficulties,searchParam);
    }
}
