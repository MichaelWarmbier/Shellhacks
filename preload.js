const { contextBridge } = require('electron');
const { getQuestions, getFilter } = require('./logic');
const { Login, Attempt, GetUser, UpdateUser, SignUp, LoadPreferences, SavePreferences } = require('./user_logic');

contextBridge.exposeInMainWorld('questions', {
    getQuestions: () => getQuestions(),

    getFilter: (selectedTopics, selectedDifficulties) => getFilter(selectedTopics, selectedDifficulties),

    Attempt: (bool) => Attempt(bool)
});

contextBridge.exposeInMainWorld('user', {
    Login: (user, pass) => Login(user, pass),

    GetUser: (user) => GetUser(user),

    UpdateUser: (user) => UpdateUser(user),

    SignUp: (info) => SignUp(info),
    
    LoadPreferences: () => LoadPreferences(),

    SavePreferences: (prefs) => SavePreferences(prefs)
})