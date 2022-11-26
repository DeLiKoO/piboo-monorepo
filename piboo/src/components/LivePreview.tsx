import { ipcRenderer } from 'electron';
import React, { ReactNode } from 'react'; // we need this to make JSX compile
import { connect } from 'react-redux';
import { AppDispatch } from '../app/store';
import { bindToCamera } from '../app/reducers/captureControlSlice';

type Message = any;
type CameraManagerMessage = any;

type LivePreviewProps = {
  dispatch: AppDispatch,
  device: string,
}

class LivePreview extends React.Component<LivePreviewProps, {}, {}> {

  myRef: React.RefObject<HTMLImageElement>;
  onMessage = (event: Electron.IpcRendererEvent, arg0: any) => {
    const message = arg0 as Message;
    if(message.class === 0) { // MessageClass.CAMERA_MANAGER
      const cmm = message as CameraManagerMessage;
      switch (cmm.type) {
        case 5: // CAMERA_LIVEPREVIEW_FRAME
          const img = this.myRef.current;
          if(img) {
            img.src = "data:image/jpeg;base64," + cmm.frame;
          }
          break;
        default:
          break;
      }
    }
  }

  constructor(props: LivePreviewProps) {
    super(props);
    const { dispatch } = props;
    dispatch(bindToCamera(props.device));
    this.myRef = React.createRef();
  }

  componentDidMount() {
    ipcRenderer.on('message', this.onMessage);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('message', this.onMessage);
  }

  render(): ReactNode {
    return <img 
      ref={this.myRef}
      width={960}
      height={540}
    />
  }
  
}

export default connect()(LivePreview);

