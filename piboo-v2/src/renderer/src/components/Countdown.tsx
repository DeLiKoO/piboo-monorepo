import { useSelector } from 'react-redux';
import {
  selectCountdown
} from '../app/reducers/captureControlSlice';
import styles from './Countdown.module.css';

export function Countdown() {
  const countdown = useSelector(selectCountdown);

  return (
    <div>
      <span className={styles.value} style={{fontSize: 120}}>{countdown}</span>
    </div>
  );
}
