const {app, BrowserWindow} = require('electron');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        show: false,
        resizable: false, 
        icon: './bulb.ico',
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.once('ready-to-show', () => {
      win.show()
    });

    mainWindow.maximize();
    mainWindow.loadFile('index.html');
    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

