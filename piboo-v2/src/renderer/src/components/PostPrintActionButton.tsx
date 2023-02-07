import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PostPrintActions.module.css';
import styles from './PostPrintActions.module.css';

type PostPrintActionButtonProps = {
    text: string,
    icon: IconDefinition,
    click: () => void,
}

export function PostPrintActionButton(props: PostPrintActionButtonProps): JSX.Element {
    const { click, text, icon } = props;
    return (
        <div className={styles.PostPrintActionButton} onClick={click}>
            <FontAwesomeIcon icon={icon} />
            <p>{text}</p>
        </div>
    );
}