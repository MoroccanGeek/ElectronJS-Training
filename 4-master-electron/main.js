// Modules
const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Listening for new item request
ipcMain.on('newItem-channel', (e, itemUrl) => {
  // Get new item and send back to renderer
  setTimeout(() => {
    e.sender.send('new-item-success', 'New item from main process')
  }, 2000)
})

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650
  })

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.defaultWidth, 
    height: mainWindowState.defaultHeight,
    minWidth: 350,
    minHeight: 300,
    webPreferences: { 
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html')

  // Manage new window state
  mainWindowState.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
