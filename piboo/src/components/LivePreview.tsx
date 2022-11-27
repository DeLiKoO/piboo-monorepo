import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react'; // we need this to make JSX compile
import { connect, useDispatch } from 'react-redux';
import { bindToCamera } from '../app/reducers/captureControlSlice';

type Message = any;
type CameraManagerMessage = any;

type ReactProps = {
  device: string,
}

type LivePreviewProps = ReactProps;

const LivePreview = (props: LivePreviewProps) => {

  const myRef: React.RefObject<HTMLImageElement> = React.createRef();
  const dispatch = useDispatch();
  
  const onMessage = (event: Electron.IpcRendererEvent, arg0: any) => {
    const message = arg0 as Message;
    if(message.class === 0) { // MessageClass.CAMERA_MANAGER
      const cmm = message as CameraManagerMessage;
      switch (cmm.type) {
        case 5: // CAMERA_LIVEPREVIEW_FRAME
          const img = myRef.current;
          if(img) {
            img.src = "data:image/jpeg;base64," + cmm.frame;
          }
          break;
        default:
          break;
      }
    }
  }

  useEffect(() => {
    dispatch(bindToCamera(props.device));
    ipcRenderer.on('message', onMessage);
    return () => {
      ipcRenderer.removeListener('message', onMessage);
    }
  }, []);

  return (
    <img 
      ref={myRef}
      width={960}
      height={540}
    />
  );
}

export default connect()(LivePreview);

