import React, { useRef } from 'react'; // we need this to make JSX compile
import { connect, useDispatch } from 'react-redux';
import Webcam from "react-webcam";
import { useReduxEffect } from '../lib/use-redux-effect';
import { onSnapshotReceived } from '@renderer/app/reducers/captureControlSlice';

const CAM_WIDTH = 1920;
const CAM_HEIGHT = 1080;
// const PLACEHOLDER_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";


type ReactProps = {
  facingMode: "user" | "environment" | "left" | "right",
}

type LivePreviewProps = ReactProps;

const LivePreview = (props: LivePreviewProps) => {

  // const [img, setImg] = useState(PLACEHOLDER_IMG);
  const webcamRef: React.Ref<Webcam> = useRef(null);

  const dispatch = useDispatch();

  const videoConstraints = {
    width: { min: CAM_WIDTH },
    height: { min: CAM_HEIGHT },
    aspectRatio: 0.6666666667,
    facingMode: props.facingMode
  };

  useReduxEffect((action) => {
    console.log("cheese!");
    if (webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      // setImg(imageSrc ?? PLACEHOLDER_IMG);
      if (imageSrc !== null) {
        dispatch(onSnapshotReceived(imageSrc));
        console.log(imageSrc);
      }
    }
  }, "capture", [webcamRef]);

  return (
    <Webcam
      audio={false}
      mirrored={true}
      ref={webcamRef}
      width={CAM_WIDTH}
      height={CAM_HEIGHT}
      videoConstraints={videoConstraints}
      screenshotFormat="image/jpeg" />
  );
}

export default connect()(LivePreview);

