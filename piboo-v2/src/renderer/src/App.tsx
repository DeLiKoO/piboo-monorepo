import Versions from './components/Versions'
import { CaptureControl } from './components/CaptureControl';
import LivePreview from './components/LivePreview';
import styles from './App.module.css';


function App(): JSX.Element {
  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>PiBoo Photobooth for RPi - Work in Progress</p>
        <Versions></Versions>
      </header>
      <div className={styles.LivePreviewContainer}>
        <div className={styles.LivePreviewOverlay1}>
          <LivePreview facingMode="user"/>
        </div>
        <div className={styles.LivePreviewOverlay2}>
          <CaptureControl />
        </div>
      </div>
    </div>
  )
}

export default App
