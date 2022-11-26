/**
 * Camera server
 */
import WebSocket from 'ws';
import WebSocketCameraManager from '../service-handlers/websocket/WebSocketCameraManager';

const wss = new WebSocket.Server({
    port: 8080,
});

wss.on('connection', function connection(ws) {
    const cameraManager = new WebSocketCameraManager(ws);
});

