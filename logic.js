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
                reject(err); 
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData.Questions); 
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                reject(jsonError); 
            }
        });
    });
}

const filteredQuestions = async (selectedTopics, selectedDifficulties, searchParam) => {
    console.log(`Topics:${selectedTopics} Diff:${selectedDifficulties} Param:${searchParam}`);

    let questions = await loadQuestions();

    let noSelectedTopics = !selectedTopics || selectedTopics.length === 0;
    let noSelectedDifficulties = !selectedDifficulties || selectedDifficulties.length === 0;
    let noSearchParam = !searchParam || searchParam.length === 0;

    if (noSelectedTopics && noSelectedDifficulties && noSearchParam) {
        console.log("No filters");
        return questions;
    }

    try {
        let filtered = []
        
        if (!noSearchParam) {
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

            if (noSelectedTopics && noSelectedDifficulties) {
                console.log("ONLY SEARCH PARAM:", filtered);
                return filtered;
            }


            console.log("NO SEARCH PARAM");
      
            let refilter = []
            if (selectedTopics.length > 0) console.log(`FILTERING ${selectedTopics}`);
            if (selectedDifficulties.length > 0) console.log(`${selectedDifficulties}`);
    
            console.log(filtered);

            for (question of filtered) {
                if (selectedTopics.includes(question.topic) || selectedDifficulties.includes(question.difficulty)) {
                    refilter.push(question);
                }
            }
    
            console.log(refilter);
            return refilter;
        }

        return filtered;
             
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
