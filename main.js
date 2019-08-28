//const {app, BrowserWindow} = require('electron');
const electron = require('electron');
const { app, BrowserWindow } = electron;

let mainWindow;

function createWindow () {

    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        show: false,
        title: "Фізичний Помічник",
        /*x: 0,
        y: 0,
        width: width, 
        height: height,*/
        resizable: false, 
        //fullscreen: true,
        //useContentSize: true,
        movable: false,
        icon: './bulb.ico',
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    //mainWindow.setMenu(null);
    //mainWindow.setSize(width, height);
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        //console.log(mainWindow.getBounds());
    });
    mainWindow.maximize();
    let size = mainWindow.getSize();
    size[1] += 40;
    mainWindow.setSize(size[0], size[1]);
    mainWindow.loadFile('index.html');
    
    //mainWindow.setResizable(false);
    //mainWindow.maximize();
    //let size = mainWindow.getBounds();
    
    
    //size.height += 20;
    //mainWindow.setBounds({height: 788});
    //mainWindow.setMaximizable(false);
    
    // mainWindow.webContents.openDevTools()
    
    /*mainWindow.on('minimize', function () {
        console.log('minimized');
    });*/

    mainWindow.on('restore', function () {
        console.log('restored');
        //mainWindow.setSize(width, height);
        mainWindow.maximize();
        mainWindow.setSize(size[0], size[1]);
        //mainWindow.setBounds({x: 0, y: 0, width: width, height: height});
        //console.log(mainWindow.getBounds());
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

