/**
 * To use this on electron, 
 * See: https://github.com/neon-bindings/examples/blob/main/electron-app/package.json
 */
import AbstractCamera from "./AbstractCamera";
import LivePreviewCallback from "./LivePreviewCallback";

import { Webcam } from 'noderscam';
import Frame from "./Frame";

export default class V4LCameraImpl implements AbstractCamera {

    path: string;
    camera: Webcam | undefined;
    livePreviewCallback: LivePreviewCallback | undefined = undefined;
    snapshotCallback: LivePreviewCallback | undefined = undefined;
    timeout: NodeJS.Timeout | undefined;
    livePreviewInterval: number = 50;  // 20fps
    livePreviewRequested: boolean = false;

    static encode(frame: ArrayBuffer): Frame {
        return Buffer.from(frame).toString('base64');
    }

    constructor(path: string = "/dev/video0") {
        this.path = path;
    }

    async connect(): Promise<void> {
        this.camera = new Webcam(this.path);
    }
    async disconnect(): Promise<void> {
        this.stopLivePreview();
        this.camera = undefined;
    }
    async registerLivePreviewCallback(cb: LivePreviewCallback): Promise<void> {
        this.livePreviewCallback = cb;
    }
    async unregisterLivePreviewCallback(cb: LivePreviewCallback): Promise<void> {
        this.livePreviewCallback = undefined;
    }
    async startLivePreview(): Promise<void> {
        this.livePreviewRequested = true;
        if(!this.isStreaming) {
            this.startStreaming();
        }
    }
    async stopLivePreview(): Promise<void> {
        this.livePreviewRequested = false;
        if(this.isStreaming) {
            this.stopStreaming();
        }
    }
    get isStreaming(): boolean {
        return (this.timeout !== undefined);
    }
    async takeSnapshot(): Promise<Frame> {
        if(this.camera === undefined) {
            throw new Error('Illegal state : not connected to camera.');
        }
        const self = this;
        return new Promise((resolve, reject) => {
            if(!self.livePreviewRequested) {
                self.startStreaming();
            }
            self.snapshotCallback = (frame: Frame) => {
                resolve(frame);
                self.snapshotCallback = undefined;
                if(!self.livePreviewRequested) {
                    self.stopStreaming();
                }
            }
        });
    }

    startStreaming(): void {
        this.timeout = setInterval(() => this.onTimer(), this.livePreviewInterval);
    }

    stopStreaming(): void {
        if(this.timeout) {
            clearInterval(this.timeout);
            this.timeout = undefined;
        }
    }

    onTimer() {
        if(!this.camera) {
            return; // or throw ?
        }
        try {
            const capture = this.camera.capture();
            const frame = V4LCameraImpl.encode(capture);
            if(this.livePreviewCallback) {
                this.livePreviewCallback(frame);
            } if(this.snapshotCallback) {
                this.snapshotCallback(frame);
            }
        } catch(e) {
            // TODO: Improve error handling by adding error argument to listeners
            this.disconnect();
            this.connect();
        }
        
        //this.timeout = setInterval(() => this.onTimer(), this.livePreviewInterval);
    }

}