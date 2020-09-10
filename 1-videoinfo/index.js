const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('index.html');
});

ipcMain.on('videoSubmit', (event, path) => {
    mainWindow.webContents.send('videoPath', path);
})