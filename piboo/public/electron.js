const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const { ipcMain } = require('electron');

const { fork } = require('child_process');
const printingNodeWorker = fork(path.join(__dirname, 'printing-worker.js'), ['args'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

const storageNodeWorker = fork(path.join(__dirname, 'storage-worker.js'), ['args'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

console.log('hi there');
printingNodeWorker.stdout.on('data', (chunk) => console.log(chunk.toString()));
printingNodeWorker.stderr.on('data', (chunk) => console.log(chunk.toString()));
storageNodeWorker.stdout.on('data', (chunk) => console.log(chunk.toString()));
storageNodeWorker.stderr.on('data', (chunk) => console.log(chunk.toString()));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

    printingNodeWorker.on('message', (message) => {
        if(mainWindow === null) {
            const e = new Error('Received a message while app is terminating.')
            console.error(e);
            return;
        }
        mainWindow.webContents.send('message', message);
    });

    storageNodeWorker.on('message', (message) => {
        if(mainWindow === null) {
            const e = new Error('Received a message while app is terminating.')
            console.error(e);
            return;
        }
        mainWindow.webContents.send('message', message);
    });

    ipcMain.on('message', (event, message) => {
        if (message.class === 0) { // MessageClass.STORAGE_MANAGER
            storageNodeWorker.send(message);
        } else if (message.class === 1) { // MessageClass.PRINTING_MANAGER
            printingNodeWorker.send(message);
        }
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800, 
        height: 600,
    });

    // and load the index.html of the app.
    console.log(__dirname);
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
