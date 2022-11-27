const electron = require('electron');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let cameraWorkerWindow;
let printingWorkerWindow;

function createWindow() {
    // Enable electron's patches for isolating renderer processes
    // To allow usage of non-context-aware native module within
    // NOTICE: This will be deprecated for electron 10 and won't work with electron >= 12
    // See: https://github.com/neon-bindings/neon/issues/470
    //
    // TODO: Wait until neon-bindings allows to create context-aware native modules, 
    //       and make 'rscam' context-aware.
    app.allowRendererProcessReuse = false;

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800, 
        height: 600, 
        webPreferences: {
            // devTools: false,
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    console.log(__dirname);
    // mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadURL('https://get.webgl.org')
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.

        cameraWorkerWindow.close();
        cameraWorkerWindow = null;
        printingWorkerWindow.close();
        printingWorkerWindow = null;
        mainWindow = null;
    });

    // Create hidden worker windows
    cameraWorkerWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            // devTools: false,
            nodeIntegration: true,
        }
    });
    printingWorkerWindow = new BrowserWindow({
        // show: false,
        webPreferences: {
            // devTools: false,
            nodeIntegration: true,
        }
    });

    // Load the workers
    cameraWorkerWindow.loadFile(path.join(__dirname, "../build/camera-worker.html"));
    cameraWorkerWindow.webContents.openDevTools();

    printingWorkerWindow.loadFile(path.join(__dirname, "../build/printing-worker.html"));
    printingWorkerWindow.webContents.openDevTools();


    // NOTICE: Setup ipcMain to relay messages between renderers
    ipcMain.on('message', (event, message) => {
        if(cameraWorkerWindow === null || printingWorkerWindow === null || mainWindow === null) {
            const e = new Error('Received a message while app is terminating.')
            console.error(e);
        }
        if(event.sender === cameraWorkerWindow.webContents || event.sender === printingWorkerWindow.webContents) {
            mainWindow.webContents.send('message', message);
        } else if (event.sender === mainWindow.webContents && message.class === 0) { // MessageClass.CAMERA_MANAGER
            cameraWorkerWindow.webContents.send('message', message);
        } else if (event.sender === mainWindow.webContents && message.class === 1) { // MessageClass.PRINTING_MANAGER
            printingWorkerWindow.webContents.send('message', message);
        } else {
            const e = new Error('Received message from an unknown/unhandled source.');
            throw e;
        }
    });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.