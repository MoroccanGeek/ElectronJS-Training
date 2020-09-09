const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addToDoWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        webPreferences: {
			nodeIntegration: true
		}
    });
    mainWindow.loadFile('main.html');

    // Close all opened windows when main window is closed
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

// Add ToDo window function
function addToDoWindowFunc(){
    addToDoWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo',
        webPreferences: {
			nodeIntegration: true
		}
    });

    addToDoWindow.loadFile('addTodo.html');
    addToDoWindow.on('closed', () => addToDoWindow = null); // best practice for Memory management
}

function clearAllTodos(){
    mainWindow.webContents.send('clearAll');
}

ipcMain.on('todoSending', (event, todo) => {

    mainWindow.webContents.send('todoRecieving',todo);
    addToDoWindow.close();
});

/**
 * App menu
 */
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New ToDo',
                click() {
                    addToDoWindowFunc();
                }
            },
            {
                label: 'Clear Todos',
                click() {
                    clearAllTodos();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'win32'?'Ctrl+Q':'Command+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'win32'?'Ctrl+Shift+I':'Command+Alt+I',
                // To specify which window shall i display DevTools on it
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}
