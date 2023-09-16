const { contextBridge } = require('electron');
const { getQuestions, getFilter } = require('./logic');

contextBridge.exposeInMainWorld('questions', {
    getQuestions: () => getQuestions(),

    getFilter: (selectedTopics, selectedDifficulties) => getFilter(selectedTopics, selectedDifficulties)
});