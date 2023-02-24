import Photobooth from './photobooth/Photobooth'
import styles from './App.module.css';
import AppHeader from './components/AppHeader';

function App(): JSX.Element {
  return (
    <div className={styles.App}>
      <AppHeader />
      <Photobooth />
    </div>
  )
}

export default App
