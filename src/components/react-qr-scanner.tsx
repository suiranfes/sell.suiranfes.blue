import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

export const QrScanner = () => {
  const _onScan = (result:IDetectedBarcode[]) => {
    console.log(result[0].rawValue);
    
  }  
  
  
  
  return <Scanner onScan={(result) => _onScan(result)} allowMultiple={true} sound={false}/>;
};