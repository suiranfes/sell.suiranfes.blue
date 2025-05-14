// External Libraries
import React from 'react';
import { useState } from 'react';
import { useZxing } from 'react-zxing';

// googlespreadsheet
import { reflectLocal } from './localToGSsheet';
import { UserComponent } from './user';
// import { LoginErrorComponent } from './loginError';
import { deleteRowFromSheet } from './SheetOperater';

// localStrage
// import { local_key_array } from './localStorageLib';
import { LocalStorageLib } from './localStorageLib';
const localStorageLib = new LocalStorageLib();

// Internal Components
// import './style.css';
import CSVTableComponent2, { CSVDownloadButton1 } from './csvDownload';
import { TotalTable } from './totalTable';
import { productData } from './data';
import { CreateCal } from './showCal';

// Material UI
import { BottomNavigation, BottomNavigationAction, Box, IconButton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Material Icons
import CalculateIcon from '@mui/icons-material/Calculate';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { Delete as DeleteIcon } from '@mui/icons-material';

// Default Data
let products = [
  { name: '', quantity: 0 },
];

// Interfaces
interface Item {
  time: string;
  quantity: string;
}
interface SellItem {
  item: string;
  quantity: number;
}

function App() {
  // const _productData: Item2[] = productData.map((data) => {
  //   const one_of_productData = {
  //     ...data,
  //     price: Number(data.price),
  //     quantity: 0
  //   }
  //   return one_of_productData;
  // });
  // const [all_products, setAll_products] = useState<Item2[]>(_productData);

  let timeArray: string[] = ["9:00", "10:00", "11:00"]; // 時間の配列
  let quantityArray: string[] = ["3", "5", "2"]; // 品物の個数の配列
  let items: Item[] = timeArray.map((time, index) => ({ time, quantity: quantityArray[index] }));
  const [QR_flag, setFlag] = useState(false);

  const set_array: SellItem[] = productData.map((data) => {
    const one_of_productData = {
      item: data.product,
      quantity: 0
    }
    return one_of_productData;
  });;
  const [_SellItem, setSellIetm] = useState<SellItem[]>(set_array);

  const [data, setData] = useState<Item[]>(items);
  const DataTable: React.FC<{ items: Item[] }> = () => {


    const handleDelete = (index: number, time: string) => {
      const confirmed = window.confirm(`データ「${time}」を削除しますか？`);
      if (!confirmed) return;
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);

      const getKey = Object.keys(localStorage);
      for (let i = 0; i < getKey.length; i++) {
        if (getKey[i].indexOf(time) >= 0) {
          localStorage.removeItem(getKey[i]);
        }
      }

      deleteRowFromSheet(time);
    };

    return (
      <TableContainer sx={{ maxWidth: 500 }} component={Paper}>
        <Table size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>時間</TableCell>
              <TableCell>品物の個数</TableCell>
              <TableCell>共有</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => { handleDelete(index, item.time); updateData(); reflectLocal(); }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const updateData = () => {
    timeArray = [];
    quantityArray = [];
    const keySplitArray: string[] = localStorageLib.local_key_array();
    //console.log(keySplitArray);

    for (let i = 0; i < localStorage.length ; i++) {
      if (keySplitArray[i] != "isUser" && keySplitArray[i] != "userEmail"){
        timeArray.unshift(keySplitArray[i]);
      }
    }
    //console.log(timeArray);
    for (let i = 0; i < localStorage.length ; i++) {
      if (keySplitArray[i] != "isUser" && keySplitArray[i] != "userEmail"){
        const localJSONData = localStorage.getItem(keySplitArray[i]) || '';
        const localParsedData = JSON.parse(localJSONData).data;
        quantityArray.unshift(localParsedData || '');
      }
    }
    items = timeArray.map((time, index) => ({ time, quantity: quantityArray[index] }));
    setData(timeArray.map((time, index) => ({ time, quantity: quantityArray[index] })));

    setSellIetm(set_array);
    const sophisticatedQuantityArray: string[][] = [];
    let newSophisticatedQuantityArray: string[] = [];
    // for (let i = 0; i < localStorage.length - 2; i++) {
    //   quantityArray[i] = quantityArray[i].replace(/[[\]""]/g, '');
    //   sophisticatedQuantityArray[i] = quantityArray[i].split(",");
    // }
    newSophisticatedQuantityArray = sophisticatedQuantityArray.flat();
    //console.log(newSophisticatedQuantityArray);
    for (let i = 0; i < _SellItem.length; i++) {
      _SellItem[i].quantity = 0;
    }
    // console.log(productData[0].product);
    // console.log(set_array);

    for (let i = 0; i < newSophisticatedQuantityArray.length; i++) {
      for (let k = 0; k < productData.length; k++) {
        if (newSophisticatedQuantityArray[i] === productData[k].product) { _SellItem[k].quantity += Number(newSophisticatedQuantityArray[i + 1]) }
      }
    }
    //console.log(_SellItem);
    setSellIetm(_SellItem);
  }

  // QR コード読み込み後の処理
  const onRecognizeCode = (e: string) => {
    //setCode(e);
    console.log(e);
    const _code = e;

    // 模擬店かどうか判別
    if (_code.indexOf("チュロス") === 0) {
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

      // local strage
      // const keys  = Object.keys(localStorage);
      // let d = new Date();
      // let year = d.getFullYear();
      // let month = d.getMonth() + 1;
      // let day = d.getDate();
      // let hour = d.getHours().toString().padStart(2, '0');
      // let minute = d.getMinutes().toString().padStart(2, '0');
      // let seconds = d.getSeconds().toString().padStart(2, '0');
      // let UTCtime = d.getTime().toString().slice(0, -3);
      // const date = UTCtime + ")" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
      //console.log(date);

      // all_products.splice(0);
      // for (let i = 0; i < _nameArray.length - 1; i++) {
      //   all_products.push(
      //     {
      //       product: _nameArray[i],
      //       price: _costArray[i],
      //       quantity: _qtyArray[i]
      //     }
      //   );
      // }
      //console.log(all_products);//showCalに渡したい
      // setAll_products(all_products);
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
      }
      //console.log(products);
      const saveData: string[] = [];
      for (let i = 0; i < products.length; i++) {
        saveData.push(JSON.stringify([products[i].name, products[i].quantity]))
      }
    }
  }

  // react-zxing の処理
  // const [qr_result, setResult] = useState(""); // テキストを出力する際(デバッグ)に利用

  const [, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(qr_result) {
      // console.log(qr_result);
      if (QR_flag === false) {
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
    reflectLocal();//localstorageのデータを全てスプレッドシートに送る
    updateData();
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
      {isVisible2 && <CreateCal />}

      {/* Page3 */}
      {isVisible3 &&
        <div id="data">
          <h2>データ</h2>
          {/*
          <h3>全体のデータ</h3>
          */}
          <h3>あなたのデータ</h3>
          {/* <CSVDownloadButton1 data={_SellItem} /> */}
          <TotalTable />
          <hr />
          {/* <CSVTableComponent2 data={data} /> */}
          <DataTable items={data} />
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
