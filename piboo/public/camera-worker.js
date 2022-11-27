const { IpcCameraManager } = require('piboo-server');
const electron = require('electron');

const ipcCameraManager = new IpcCameraManager(electron.ipcRenderer);

cameraWorkerWindow.on('close', () => {
    ipcCameraManager.dispose();
    ipcCameraManager = null;
});
