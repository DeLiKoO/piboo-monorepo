const { IpcPrintingManager } = require('piboo-server');
const process = require('process');

console.log('printing-worker starting');
const ipcPrintingManager = new IpcPrintingManager(process);
console.log('printing-worker started');

process.on('exit', () => {
    ipcPrintingManager.dispose();
    console.log('printing-worker exited');
});

process.on('message', (message) => {
    console.log('printing-worker', {message});
    if(message === undefined) {
        return;
    }
    ipcPrintingManager.handleMessage(message);
});

function loop() {
    setTimeout(() => loop(), 1000);
}

loop();
