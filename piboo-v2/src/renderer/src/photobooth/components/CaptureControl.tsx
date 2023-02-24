import styles from './CaptureControl.module.css';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../store';
import { startSeries, isPrinting, onPrintingCompleted } from '../store/seriesControlSlice';
import { Countdown } from './Countdown';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';
import { selectCountdown, startLivePreview, stopLivePreview } from '../store/captureControlSlice';

type CaptureControlProps = {
  //device: string,
}

export function CaptureControl(props: CaptureControlProps): JSX.Element {

    const myRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const printing = useSelector(isPrinting);
    const countdown = useSelector(selectCountdown);

    useEffect(() => {
        if(printing) {
            dispatch(stopLivePreview())
        } else {
            dispatch(startLivePreview())
        }
    }, [printing]);

    const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if(event.code === 'Space') {
            dispatch(startSeries());
        }
        if(event.code === 'R' && printing) {
            dispatch(onPrintingCompleted());
        }
    }

    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        dispatch(startSeries());
    }

    // myRef.current?.focus({ preventScroll: false });

    return (
    <div
        ref={myRef}
        className={styles.FlexCenterContainer}
        onKeyPress={onKeyPress}
        onClick={onClick}
        tabIndex={-1}>
        {( printing || countdown === 0) && <Spinner animation={printing ? "border" : "grow"} />}
        {(!printing && countdown !== 0) && <Countdown />}
    </div>
    );
}