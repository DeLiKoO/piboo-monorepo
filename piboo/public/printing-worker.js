const { IpcPrintingManager } = require('piboo-server');
const electron = require('electron');
const remote = require('electron').remote;

const ipcPrintingManager = new IpcPrintingManager(electron.ipcRenderer);

printingWorkerWindow.on('close', () => {
    ipcPrintingManager.dispose();
    ipcPrintingManager = null;
});
