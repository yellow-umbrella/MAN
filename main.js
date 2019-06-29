const {app, BrowserWindow} = require('electron');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: './physics-512.ico',
        title: 'MAN  // TODO: TITLE',
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

