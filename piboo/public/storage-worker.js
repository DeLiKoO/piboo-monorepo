const { IpcStorageManager } = require('piboo-server');
const process = require('process');

console.log('storage-worker starting');
const ipcStorageManager = new IpcStorageManager(process);
console.log('storage-worker started');

process.on('exit', () => {
    ipcStorageManager.dispose();
    console.log('storage-worker exited');
});

process.on('message', (message) => {
    console.log('storage-worker', {message});
    if(message === undefined) {
        return;
    }
    ipcStorageManager.handleMessage(message);
});

function loop() {
    setTimeout(() => loop(), 1000);
}

loop();
