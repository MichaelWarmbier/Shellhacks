const { app, BrowserWindow } = require('electron');
const path = require('node:path');
require('./logic');

const createWindow = () => {
    const window = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    })

    window.loadFile('Frontend/app.html');
}

app.whenReady()
    .then(() => {
        createWindow()
    })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})