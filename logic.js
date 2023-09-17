const fs = require('fs');

const siteData = {
    topicFilter: [],
    diffcultyFilter: [],
    currentQuestion: {}
}

const QuestionType = {
    MultipleChoice: 0,
    OpenEnded: 1
}

const question = {
    title: '',
    summary: '',
    keywords: '',
    topic: '',
    difficulty: '',
    type: QuestionType.MultipleChoice,
    answer: 0
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

const filteredQuestions = async (selectedTopics, selectedDifficulties) => {
    let questions = await loadQuestions();

    try {
        const filteredQuestions = questions.filter((question) => {
            return (
                selectedTopics.includes(question.topic) &&
                selectedDifficulties.includes(question.difficulty)
            );
        });

        return filteredQuestions;
    } catch (error) {
        console.error('Error filtering questions:', error);
        throw error;
    }
}

const selectedTopics = ['Math'];
const selectedD = ['Easy'];

module.exports = {
    getQuestions: async () => {
        return await loadQuestions();
    },

    getFilter: async (selectedTopics, selectedDifficulties) => {
        return await filteredQuestions(selectedTopics, selectedDifficulties);
    }
}