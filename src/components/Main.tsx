// External Libraries
import { useState } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

// Material UI/Icons
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import CalculateIcon from '@mui/icons-material/Calculate';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

// Internal Components
import { CreateCal } from './showCal';
import { UserComponent } from './user'; // Google Spread Sheet
import { HolisticTable } from './HolisticTable';

// Default Data
let products = [{ name: '', quantity: 0 }];

function App() {
  const [qrItems, setQrItems] = useState<{ name: string; quantity: number }[]>([]);

  // QR コード読み込み後の処理
  const onRecognizeCode = (readCode: string) => {
    // 品ごとに分割
    const _allArray = readCode.replace(/\s+/g, "").split(";");
    const _nameArray: string[] = new Array(_allArray.length - 1);
    const _costArray: number[] = new Array(_allArray.length - 1);
    const _qtyArray: number[] = new Array(_allArray.length - 1);
    const _sumArray: number[] = new Array(_allArray.length - 1);
    // それぞれの要素に分割
    for (let i = 0; i < _allArray.length; i++) {
      const splitArray = _allArray[i].split(",");
      _nameArray[i] = splitArray[0];
      _costArray[i] = Number(splitArray[1]);
      _qtyArray[i] = Number(splitArray[2]);
      _sumArray[i] = Number(splitArray[3]);
    }

    //表示する商品
    products = [];
    for (let i = 0; i < _nameArray.length - 1; i++) {
      if (_qtyArray[i] !== 0) {
        products.push({
          name: _nameArray[i],
          quantity: _qtyArray[i]
        });
      }
      setQrItems(products);
    }

    const saveData: string[] = [];
    for (let i = 0; i < products.length; i++) {
      saveData.push(JSON.stringify([products[i].name, products[i].quantity]))
    }
  }

  //react-qr-scannerの処理
  const _onScan = (result: IDetectedBarcode[]) => {
    onRecognizeCode(result[0].rawValue);
    ChangePage(2);
  }

  // ページ処理
  const [isVisible, setIsVisible] = useState<boolean[]>([true, false, false, false]);
  const [BarColor, setBarColor] = useState<string[]>(["#afeeee", "white", "white", "white"]);
  const ChangePage = (pageNumber: number) => {
    const visibilityArray = [false, false, false, false];
    visibilityArray[pageNumber - 1] = true;
    setIsVisible(visibilityArray); // ページの表示状態を更新

    const colorArray = ["white", "white", "white", "white"];
    colorArray[pageNumber - 1] = "#afeeee";
    setBarColor(colorArray); // ページバーの背景色を更新
  }

  return (
    <div className="App" style={{ margin: "0 10% 68px 10%" }}>
      {/* Page1 */}
      {isVisible[0] &&
        <div id="QR">
          <h2>QR コード</h2>
          <center>
            <Scanner onScan={(result) => _onScan(result)} allowMultiple={true} sound={false} />
          </center>
        </div>
      }

      {/* Page2 */}
      {isVisible[1] && <CreateCal qrItems={qrItems} />}

      {/* Page3 */}
      {isVisible[2] && <HolisticTable />}

      {/* Page4 */}
      {isVisible[3] && <UserComponent />}

      {/* footer */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation>
          <Box bgcolor={BarColor[0]}><BottomNavigationAction label="QR コード" icon={<QrCodeIcon />} onClick={() => ChangePage(1)} /></Box>
          <Box bgcolor={BarColor[1]}><BottomNavigationAction label="電卓" icon={<CalculateIcon />} onClick={() => ChangePage(2)} /></Box>
          <Box bgcolor={BarColor[2]}><BottomNavigationAction label="データ" icon={<DataThresholdingIcon />} onClick={() => ChangePage(3)} /></Box>
          <Box bgcolor={BarColor[3]}><BottomNavigationAction label="ユーザー" icon={<AccessibilityNewIcon />} onClick={() => ChangePage(4)} /></Box>
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default App;
