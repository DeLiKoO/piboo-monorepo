import '@fortawesome/fontawesome-free/js/all';
import { faCheck, faPrint } from '@fortawesome/free-solid-svg-icons';
import { onSeriesCompleted, startPrinting } from '../app/reducers/seriesControlSlice';
import { useAppDispatch } from '../app/store';
import { PostPrintActionButton } from './PostPrintActionButton';
import './PostPrintActions.module.css';
import styles from './PostPrintActions.module.css';

export function PostPrintActions(): JSX.Element {

    const dispatch = useAppDispatch();

    const onPrintAgain = () => {
        dispatch(startPrinting());
    }
    const onDone = () => {
        dispatch(onSeriesCompleted());
    }

    return (
        <div className={styles.PostPrintActionsContainer}>
            <PostPrintActionButton text="Imprimer à nouveau" icon={faPrint} click={onPrintAgain} />
            <PostPrintActionButton text="Terminé" icon={faCheck} click={onDone}/>
        </div>
    );
}