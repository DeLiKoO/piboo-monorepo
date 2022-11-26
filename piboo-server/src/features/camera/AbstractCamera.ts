import Frame from "./Frame";
import LivePreviewCallback from "./LivePreviewCallback";
        
export default interface AbstractCamera {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    registerLivePreviewCallback(cb: LivePreviewCallback): Promise<void>;
    unregisterLivePreviewCallback(cb: LivePreviewCallback): Promise<void>;
    startLivePreview(): Promise<void>;
    stopLivePreview(): Promise<void>;
    takeSnapshot(): Promise<Frame>;
}

