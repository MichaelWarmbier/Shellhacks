const fs = require('fs');
const path = require('node:path');
const axios = require('axios');

const endpointUrl = 'https://server-06.kirbout.repl.co/';
const preferencesPath = 'preferences.json';

let preferences = {
  "darkMode": false,
  "session":null
}

async function LoadPreferences() {
    return new Promise((resolve, reject) => {
        fs.readFile(preferencesPath, 'utf8', async (err, data) => {
            if(err) {
              console.error('Error reading JSON file', err);
            }
            else {
              try {
                const jsonData = await JSON.parse(data);
        
                preferences = jsonData;
                resolve(preferences);
              } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
              }
            }
          });
    });
}

async function SavePreferences(pref) {
  console.log("SAVING");
  const json = JSON.stringify(pref);

  fs.writeFile(preferencesPath, json, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file', err);
    } else {
      console.log('JSON written to', preferencesPath);
      console.log(json);
    }
  })
}

async function getUser(user) {
    return new Promise((resolve, reject) => {
        axios.get(`https://server-06.kirbout.repl.co/users?username=${user}`)
    .then(response => {
        if (response.status === 200) {
        resolve(response.data);
        } else {
        console.error('Unexpected status code:', response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        }
    });
    });
}

async function updateUser(newUser){
  axios.post('https://server-06.kirbout.repl.co/update-user', (newUser))
  .then(response => {
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Unexpected status code:', response.status);
    }
  })
  .catch(error => {
    console.error('Error:', error);

    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  });
}

async function signUp(info) {
    return new Promise((resovlve, reject) => {
        axios.post('https://server-06.kirbout.repl.co/signup', (info))
        .then(response => {
          if (response.status === 200) {
            return response.data;
          } else {
            console.error('Unexpected status code:', response.status);
          }
        })
        .catch(error => {
          console.error('Error:', error);
      
          if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
          }
        });
    });
}

async function login(user, pass) {
  return new Promise((resolve, reject) => {
    axios.get(`https://server-06.kirbout.repl.co/login?username=${user}&password=${pass}`)
    .then(response => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        console.error('Unexpected status code:', response.status);
      }
    })
    .catch(error => {
      console.error('Error:', error);
  
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      }
    });
  })
}

module.exports = {
  Login: (username, password) => login(username, password),

  Attempt: (solved) => OnAttempt(solved),

  GetUser: (user) => getUser(user),

  UpdateUser: (newUser) => updateUser(newUser),

  SignUp: (info) => signUp(info),

  LoadPreferences: () => LoadPreferences(),

  SavePreferences: (prefs) => SavePreferences(prefs)
}
