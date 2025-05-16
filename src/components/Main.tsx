// External Libraries
import { useState } from 'react';
import { useZxing } from 'react-zxing';

// Material UI/Icons
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import CalculateIcon from '@mui/icons-material/Calculate';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { HolisticTable } from './HolisticTable';

// Internal Components
// import CSVTableComponent2, { CSVDownloadButton1 } from './csvDownload';
import { CreateCal } from './showCal';
import { UserComponent } from './user'; // Google Spread Sheet

// Default Data
let products = [
  { name: '', quantity: 0 },
];

function App() {
  const [qrItems, setQrItems] = useState<{ name: string; quantity: number }[]>([]);
  const [QR_flag, setFlag] = useState(false);

  // QR コード読み込み後の処理
  const onRecognizeCode = (e: string) => {
    //setCode(e);
    console.log(e);
    const _code = e;

    // // 模擬店かどうか判別
    // if (_code.indexOf("チュロス") !== 0) {
    //   return;
    // }

    // 品ごとに分割
    const _allArray = _code.replace(/\s+/g, "").split(";");
    const _nameArray: string[] = new Array(_allArray.length - 1);
    const _costArray: number[] = new Array(_allArray.length - 1);
    const _qtyArray: number[] = new Array(_allArray.length - 1);
    const _sumArray: number[] = new Array(_allArray.length - 1);
    // それぞれの要素に分割
    for (let i = 0; i < _allArray.length; i++) {
      const a = _allArray[i].split(",");
      const name = a[0];
      const cost = Number(a[1]);
      const qty = Number(a[2]);
      const eachSum = Number(a[3]);
      _nameArray[i] = name;
      _costArray[i] = cost;
      _qtyArray[i] = qty;
      _sumArray[i] = eachSum;
    }

    //表示する商品
    products = [];
    for (let i = 0; i < _nameArray.length - 1; i++) {
      if (_qtyArray[i] !== 0) {
        products.push(
          {
            name: _nameArray[i],
            quantity: _qtyArray[i]
          }
        );
      }
      setQrItems(products);
    }
    //console.log(products);
    const saveData: string[] = [];
    for (let i = 0; i < products.length; i++) {
      saveData.push(JSON.stringify([products[i].name, products[i].quantity]))
    }
  }

  // react-zxing の処理
  // const [qr_result, setResult] = useState(""); // テキストを出力する際(デバッグ)に利用

  const [, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(qr_result) {
      // console.log(qr_result);
      if (!QR_flag) {
        setFlag(true);
        const outputText = qr_result.getText();

        onRecognizeCode(outputText); // 結果を渡す
        setResult(outputText);

        Page2(); // Page2 を開く
      }
      stopScanning(); // QR コードが読み取れた時に止める
    },
  });
  // QRコードの読み取りを開始する
  // const startScanning = () => {
  //   if (ref.current) {
  //     ref.current.play(); // ビデオ再生を開始する
  //   }
  // };
  // QRコードの読み取りを停止する
  const stopScanning = () => {
    if (ref.current) {
      ref.current.pause(); // ビデオ再生を停止する
    }
  };
  // ページリロード
  function reloadPage() {
    window.location.reload();
  }

  // ページ処理
  const [isVisible1, setIsVisible1] = useState<boolean>(true);
  const [isVisible2, setIsVisible2] = useState<boolean>(false);
  const [isVisible3, setIsVisible3] = useState<boolean>(false);
  const [isVisible4, setIsVisible4] = useState<boolean>(false);
  const [BarColor, setBarColor] = useState<string[]>(["#afeeee", "white", "white", "white"]);
  const Page1 = () => {
    setIsVisible1(true);
    setIsVisible2(false);
    setIsVisible3(false);
    setIsVisible4(false);
    reloadPage();
    // QRコード後の処理のフラグを消すこと！
    setFlag(false);
  }
  const Page2 = () => {
    setIsVisible1(false);
    setIsVisible2(true);
    setIsVisible3(false);
    setIsVisible4(false);
    setBarColor(["white", "#afeeee", "white", "white"])
    // stopScanning();
  }
  const Page3 = () => {
    setIsVisible1(false);
    setIsVisible2(false);
    setIsVisible3(true);
    setIsVisible4(false);
    setBarColor(["white", "white", "#afeeee", "white"])
    // updateData();
    // stopScanning();
  }
  const Page4 = () => {
    setIsVisible1(false);
    setIsVisible2(false);
    setIsVisible3(false);
    setIsVisible4(true);
    setBarColor(["white", "white", "white", "#afeeee"]);
    // stopScanning();
  }

  return (
    <div className="App" style={{ margin: "0 10% 68px 10%" }}>
      {/* <LoginErrorComponent/> */}

      {/* Page1 */}
      {isVisible1 &&
        <div id="QR">
          <h2>QR コード</h2>
          <video ref={ref} style={{ width: "100%", borderRadius: "16px" }} />
          {/* <p>
            <span>Last result: </span>
            <span>{qr_result}</span>
          </p> */}
          {/* <Button variant="outlined" onClick={reloadPage}>カメラを再起動</Button> */}
          {/* <p>合計金額: {sum} 円</p> */}
        </div>
      }

      {/* Page2 */}
      {isVisible2 && <CreateCal qrItems={qrItems} />}

      {/* Page3 */}
      {isVisible3 &&
        <div id="data">
          <h2>データ</h2>
          <HolisticTable />
        </div>
      }

      {/* Page4 */}
      {isVisible4 && <UserComponent />}

      {/* footer */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation>
          <Box bgcolor={BarColor[0]}><BottomNavigationAction label="QR コード" icon={<QrCodeIcon />} onClick={Page1} /></Box>
          <Box bgcolor={BarColor[1]}><BottomNavigationAction label="電卓" icon={<CalculateIcon />} onClick={Page2} /></Box>
          <Box bgcolor={BarColor[2]}><BottomNavigationAction label="データ" icon={<DataThresholdingIcon />} onClick={Page3} /></Box>
          <Box bgcolor={BarColor[3]}><BottomNavigationAction label="ユーザー" icon={<AccessibilityNewIcon />} onClick={Page4} /></Box>
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default App;
