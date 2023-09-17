/*//// Data ////*/

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const md5 = require('md5');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const port = 3000;
let users = null

/*//// Main ////*/

new Promise(async (resolve, reject) => {
  await readFileAsync('users.json', 'utf8', async (err, data) => {
    users = await JSON.parse(data);
    //console.log(users);
  });

})

app.use(bodyParser.json());

function validateUserData(username, password) {

  if (username === undefined || password === undefined) {
    throw new Error('Username and Password required');
  }
}

async function createUser(username, password) {
  console.log("DESIRED USERNAME:", username);

  for (let i = 0; i < users.length; i++) {
    if (users[i].Username === username) {
      throw new Error('Username taken');
    }
  }

  const newUser = {
    Username: username,
    Password: password,
    Solved: 0,
    IDs: 0,
    Session: 0
  };

  return newUser;
}

/*//// Events ////*/

app.get('/users', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'No username provided' });
  }

  try {
    for (user of users) if (user.Username === username) {
      return res.json({
        Solved: user.Solved,
        IDs: user.IDs,
        Session: user.Session
      });
    } 
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/update-user', async (req, res) => {
  const { username, solved, IDs, icon } = req.body;
  console.log("UPDATE TO:", req.body);
  if (!username) {
    return res.status(400).json({ error: 'Username is required in the request body' });
  }

  let userIndex = undefined;

  for (let i = 0; i < users.length; i++) {
    console.log(users[i].Username);
    if (users[i].Username === username) {
      userIndex = i;
    }
  }

  if (userIndex === undefined) {
    console.log("User doesnt exist");
    return res.status(404).json({ error: 'User not found' });
  }

  if (solved !== undefined) {
    users[userIndex].Solved = solved;
  }

  if (icon !== undefined) {
    users[userIndex].Icon = icon;
  }

  if (IDs !== undefined) {
    console.log(IDs);
    users[userIndex].IDs = IDs;
  }
  console.log(users[userIndex]);
  await writeFileAsync('users.json', JSON.stringify(users));
  return res.status(200).json({ message: `User data updated successfully ${users[userIndex]}` });
});

app.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;

    validateUserData(username, password);
    let newUser = await createUser(username, password);

    users.push(newUser);
    await writeFileAsync('users.json', JSON.stringify(users));
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get('/login', async (req, res) => {

  const { username, password } = await req.query;

  for (let i = 0; i < users.length; i++)
    if (users[i].Username === username && users[i].Password === password) {
      let session = md5(username + (new Date).getDate());
      users[i].Session = session;
      await writeFileAsync('users.json', JSON.stringify(users));
      return res.status(200).json({ session });
    }
  return res.send('Invalid')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
