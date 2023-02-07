import Versions from './components/Versions'
import { CaptureControl } from './components/CaptureControl';
import LivePreview from './components/LivePreview';
import styles from './App.module.css';
import { PostPrintActions } from './components/PostPrintActions';
import { useSelector } from 'react-redux';
import { isPostPrinting } from './app/reducers/seriesControlSlice';
import { InfoTip } from './components/InfoTip';

function App(): JSX.Element {
  const postPrinting = useSelector(isPostPrinting);
  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>PiBoo Photobooth for RPi - Work in Progress</p>
        <Versions></Versions>
        <InfoTip />
      </header>
      <div className={styles.LivePreviewContainer}>
        <div className={styles.LivePreviewOverlay1}>
          <LivePreview facingMode='user'/>
        </div>
        <div className={styles.LivePreviewOverlay2}>
        { postPrinting && <PostPrintActions />}
        { !postPrinting && <CaptureControl />}
        </div>
      </div>
    </div>
  )
}

export default App
