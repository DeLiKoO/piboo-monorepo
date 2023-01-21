import React from 'react';
import './App.module.css';
import styles from './App.module.css';
import { CaptureControl } from './CaptureControl';
import LivePreview from './LivePreview';


function App() {

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        PiBoo Photobooth for RPi - Work in Progress
        <div className={styles.LivePreviewContainer}>
          <div className={styles.LivePreviewOverlay1}>
            <LivePreview facingMode="user"/>
          </div>
          <div className={styles.LivePreviewOverlay2}>
            <CaptureControl />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
