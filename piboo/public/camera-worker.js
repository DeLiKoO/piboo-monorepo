const { IpcCameraManager } = require('piboo-server');
const process = require('process');

console.log('camera-worker starting');
const ipcCameraManager = new IpcCameraManager(process);
console.log('camera-worker started');

process.on('exit', () => {
    ipcCameraManager.dispose();
    console.log('camera-worker exited');
});

process.on('message', (message) => {
    console.log('camera-worker', {message});
    if(message === undefined) {
        return;
    }
    ipcCameraManager.handleMessage(message);
});

function loop() {
    setTimeout(() => loop(), 1000);
}

loop();
