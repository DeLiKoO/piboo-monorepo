const { IpcCameraManager } = require('piboo-server');
const electron = require('electron');
const remote = require('electron').remote;

const ipcCameraManager = new IpcCameraManager(electron.ipcRenderer);

cameraWorkerWindow.on('close', () => {
    ipcCameraManager.dispose();
    ipcCameraManager = null;
});
