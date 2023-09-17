const axios = require('axios');
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { LoadPreferences } = require('./user_logic');
require('./logic');
require('./user_logic');
require('./wiki');

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1000,
        height: 1080,
        minWidth: 500,
        minHeight: 500,
        autoHideMenuBar: true,
        title: 'DeepDive - Powered By Electron and Node.js',
        titleBarOverlay: {
            color: 'red',
            height: 30,
            width: 100,
            symbolColor: 'white'
        },
        webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
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