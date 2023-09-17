const { contextBridge } = require('electron');
const { getQuestions, getFilter } = require('./logic');
const { Login, Attempt, GetUser, UpdateUser, SignUp, SavePreferences, LoadPreferences } = require('./user_logic');
const { SearchWiki } = require('./wiki');

contextBridge.exposeInMainWorld('questions', {
    getQuestions: () => getQuestions(),

    getFilter: (selectedTopics, selectedDifficulties, searchParam) => getFilter(selectedTopics, selectedDifficulties, searchParam),

    Attempt: (bool) => Attempt(bool)
});

contextBridge.exposeInMainWorld('user', {
    Login: (user, pass) => Login(user, pass),

    GetUser: (user) => GetUser(user),

    UpdateUser: (user) => UpdateUser(user),

    SignUp: (info) => SignUp(info),

    LoadPreferences: () => LoadPreferences(),

    SavePreferences: (prefs) => SavePreferences(prefs)
});

contextBridge.exposeInMainWorld('wiki', {
    SearchWiki: (keyword, limit) => SearchWiki(keyword, limit)
})