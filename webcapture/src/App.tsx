import { useState, useRef, useCallback } from 'react'
import Webcam from "react-webcam";
import './App.css'
import {decode as b64dec} from './base64'

function fromDataUri(uri: string) {
	if (!/^data:/i.test(uri)) {
		throw new TypeError(
			'`uri` does not appear to be a Data URI (must begin with "data:")'
		);
	}
  const firstComma = uri.indexOf(',');
	const data = unescape(uri.substring(firstComma + 1));
	return b64dec(data);
}

// fileHandle is a FileSystemFileHandle
// withWrite is a boolean set to true if write

async function verifyPermission(fileHandle: FileSystemFileHandle, mode: 'readwrite' | 'read') {
  const opts = { mode };

  // Check if we already have permission, if so, return true.
  if (await (fileHandle as any).queryPermission(opts) === 'granted') {
    return true;
  }

  // Request permission to the file, if the user grants permission, return true.
  if (await (fileHandle as any).requestPermission(opts) === 'granted') {
    return true;
  }

  // The user did not grant permission, return false.
  return false;
}

async function savePicture(data: ArrayBuffer) {
  console.log("saving...");
  const root = await navigator.storage.getDirectory();
  const newHandle = await root.getFileHandle('capture.jpg', { create: true });
  if(!await verifyPermission(newHandle, 'readwrite')) {
    console.log("Couldnt get permission to write file from user ");
    return;
  }
  const writableStream = await (newHandle as any).createWritable();
  await writableStream.write(data);
  await writableStream.close();
  console.log("wrote", newHandle.getFile())
}

function App() {
  const [count, setCount] = useState(0)

  const CAM_WIDTH = 1920;
  const CAM_HEIGHT = 1080;
  const PLACEHOLDER_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

  const videoConstraints = {
    width: { min: CAM_WIDTH },
    height: { min: CAM_HEIGHT },
    aspectRatio: 0.6666666667,
    facingMode: "user"
  };

  const [img, setImg] = useState(PLACEHOLDER_IMG);
  const webcamRef: React.Ref<Webcam> = useRef(null);

  const capture = useCallback(async () => {
    console.log("coucou1");
    if(webcamRef.current !== null) {
      console.log("coucou2");
      const imageSrc = webcamRef.current.getScreenshot();
      console.log("coucou3");
      setImg(imageSrc ?? PLACEHOLDER_IMG);
      if(imageSrc !== null) {
        console.log("coucou4");
        await savePicture(fromDataUri(imageSrc));
      }
    }
  }, [webcamRef]);

  return (
    <div className="App">
      <Webcam 
        audio={false} 
        mirrored={true} 
        ref={webcamRef} 
        width={CAM_WIDTH} 
        height={CAM_HEIGHT} 
        videoConstraints={videoConstraints} 
        screenshotFormat="image/jpeg" />
      <button onClick={capture}>Capture photo</button>
      <img src={img} alt="screenshot" />
      <pre style={{width: "1920px", overflow: 'scroll' }}>{img}</pre>
    </div>
  )
}

export default App
