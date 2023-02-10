import React, { useRef, useState } from 'react'; // we need this to make JSX compile
import { connect, useDispatch } from 'react-redux';
import Webcam from "react-webcam";
import { useReduxEffect } from '../lib/use-redux-effect';
import { onSnapshotReceived, stopLivePreview } from '@renderer/app/reducers/captureControlSlice';

const CAM_WIDTH = 1920;
const CAM_HEIGHT = 1080;
const PLACEHOLDER_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

type ReactProps = {
  facingMode: "user" | "environment" | "left" | "right",
}

type LivePreviewProps = ReactProps;

const LivePreview = (props: LivePreviewProps) => {

  const webcamRef: React.Ref<Webcam> = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [placeholderImage, setPlaceholderImage] = useState(PLACEHOLDER_IMG);

  const dispatch = useDispatch();

  const videoConstraints = {
    width: { min: CAM_WIDTH },
    height: { min: CAM_HEIGHT },
    aspectRatio: 0.6666666667,
    facingMode: props.facingMode,
    frameRate: { max: 25 },
  };

  useReduxEffect((action) => {
    if (webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc !== null) {
        dispatch(onSnapshotReceived(imageSrc));
        setPlaceholderImage(imageSrc);
      }
    }
  }, "capture", [webcamRef]);

  useReduxEffect((action) => {
    setEnabled(true);
  }, "startLivePreview");

  useReduxEffect((action) => {
    setEnabled(false);
  }, "stopLivePreview");

  return (
    <div style={{width:'100%', height:'100%', backgroundColor: 'white', backgroundImage: `url(${placeholderImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}>
      <Webcam
        autoFocus={true}
        hidden={!enabled}
        audio={false}
        mirrored={true}
        ref={webcamRef}
        width='100%'
        height='100%'
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        forceScreenshotSourceSize={true}
        imageSmoothing={false} />
    </div>
  );
}

export default connect()(LivePreview);

