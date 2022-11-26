import AbstractCamera from "./AbstractCamera";
import Driver from "./Driver";
import V4LCameraImpl from "./V4LCameraImpl";

export default class CameraFactory {
    
    static createCamera(driver: Driver): AbstractCamera {
        switch (driver.name) {
            case 'V4L':
                return new V4LCameraImpl(driver.settings.path);
            default:
                throw new Error(`Unsupported driver '${driver.name}'.`);
        }
    }

}