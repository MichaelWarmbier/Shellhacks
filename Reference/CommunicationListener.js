/* Listens to communication from external program via JSON file */

const fs = require('fs');

async function listenForData(portName, listenTimeMS) {
  
  const attemptsToMake = Math.floor(listenTimeMS / 100);
  let totalAttempts = 0;

  return new Promise((resolve, reject) => {
    const PingInterval = setInterval (() => {
      totalAttempts++;
      fs.readFile(`${portName}.json`, 'utf8', function(err, data) {

        if (totalAttempts >= attemptsToMake) { 
          clearInterval(PingInterval); 
          resolve({ERROR: 'Response too slow'});
        }
          
        else if (!err && data) {
          fs.unlinkSync(`${portName}.json`);
          try { data = JSON.parse(data); }
          catch { clearInterval(PingInterval); resolve({ERROR: 'Invalid format'}); }
          resolve(data);
        }
          
      })
    }, 100);
  })
}
