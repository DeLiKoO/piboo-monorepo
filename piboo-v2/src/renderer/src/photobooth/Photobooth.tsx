import { CaptureControl } from './components/CaptureControl';
import LivePreview from './components/LivePreview';
import styles from './Photobooth.module.css';
import { PostPrintActions } from './components/PostPrintActions';
import { useSelector } from 'react-redux';
import { isPostPrinting } from './store/seriesControlSlice';
import { InfoTip } from './components/InfoTip';

function Photobooth(): JSX.Element {
  const postPrinting = useSelector(isPostPrinting);
  return (
    <div className={styles.VLayout}>
      <InfoTip />
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

export default Photobooth
