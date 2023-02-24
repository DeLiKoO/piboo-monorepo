import styles from './AppHeader.module.css';
import NavBar from './NavBar';
import Versions from './Versions';

function App(): JSX.Element {
  return (
      <header className={styles.AppHeader}>
        <p>PiBoo Photobooth for RPi - Work in Progress</p>
        <Versions></Versions>
        <NavBar />
      </header>
  )
}

export default App
