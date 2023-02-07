import { useSelector } from 'react-redux';
import { isPrinting, selectCaptureInSeries, SERIES_NOT_STARTED } from '../app/reducers/seriesControlSlice';


type InfoTipProps = {
    //device: string,
  }
  
  export function InfoTip(props: InfoTipProps): JSX.Element {
  
      const printing = useSelector(isPrinting);
      const captureInSeries = useSelector(selectCaptureInSeries);

      let message = "";
      if(printing) {
        message = "L'impression est en cours... Veuillez patienter 30 secondes 😄";
      } else if(captureInSeries === SERIES_NOT_STARTED) {
          message = "Touchez l'écran pour prendre une série de photos ! 😊";
        } else {
          message = `Photo ${captureInSeries}/3`;
      }
  
      return (
      <div>
          {message}
      </div>
      );
  }