import styles from './CaptureControl.module.css';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch } from '../app/store';
import { startSeries, isPrinting } from '../app/reducers/seriesControlSlice';
import { Countdown } from './Countdown';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';
import { startLivePreview, stopLivePreview } from '../app/reducers/captureControlSlice';

type CaptureControlProps = {
  //device: string,
}

export function CaptureControl(props: CaptureControlProps): JSX.Element {

    const myRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const printing = useSelector(isPrinting);

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
    }

    // myRef.current?.focus({ preventScroll: false });

    return (
    <div
        ref={myRef}
        className={styles.FlexCenterContainer}
        onKeyPress={onKeyPress}
        tabIndex={-1}>
        <Spinner animation={printing ? "border" : "grow"} />
        {!printing && <Countdown />}
    </div>
    );
}