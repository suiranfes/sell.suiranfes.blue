// External Library
import { useState } from 'react';
import { useZxing } from 'react-zxing';

// firebase
// import db from "./firebase";

// Internal Component
import { productData } from './data';
import { CreateCal } from './showCal';
import { CSVDownloadButton1 } from './csvDownload';
import CSVTableComponent2 from './csvDownload';

// Material UI
import { Paper } from '@mui/material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Icons
import QrCodeIcon from '@mui/icons-material/QrCode2';
import ListIcon from '@mui/icons-material/List';
import CalculateIcon from '@mui/icons-material/Calculate';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import DataFromFirebase from './dataFromFirebase';

// Default Data
let products = [
  { name: '', quantity: 0 },
];

interface Item {
  time: string;
  quantity: string;
}
interface SellItem {
  item: string;
  quantity: number;
}

// 表を描画するTableコンポーネント
function Table({ data }: { data: { name: string, quantity: number }[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>商品名</th>
          <th>個数</th>
        </tr>
      </thead>
      <tbody>
        {data.map((product, index) => (
          <tr key={index}>
            <td>{product.name}</td>
            <td>{product.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

//買われた総数を表示する表のコンポーネント
const ItemTable: React.FC<{ items: SellItem[] }> = ({ items }) => {
  return (
    <table>
      <thead>
        <tr>
          {items.map((_item, index) => (
            <th key={index}>{_item.item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {items.map((_item, index) => (
            <td key={index}>{_item.quantity}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

function App() {
  // interface DataObject {
  //   [key: string]: any;
  // }

  let timeArray: string[] = ["9:00", "10:00", "11:00"]; // 時間の配列
  let quantityArray: string[] = ["3", "5", "2"]; // 品物の個数の配列
  let items: Item[] = timeArray.map((time, index) => ({ time, quantity: quantityArray[index] }));
  const [QR_flag, setFlag] = useState(false);
  // 入力したお金 (後の処理でお釣りを求める)
  const [inputValue, setInputValue] = useState(0);

  const in_order_to_set_array: SellItem[] = productData.map((data) => {
    const one_of_productData = {
      item: data.product,
      quantity: 0
    }
    return one_of_productData;
  });;
  const [_SellItem, setSellIetm] = useState<SellItem[]>(in_order_to_set_array);

  const [data, setData] = useState<Item[]>(items);
  const DataTable: React.FC<{ items: Item[] }> = ({ items }) => {
    //console.log(items);
    const handleDelete = (index: number, time: string) => {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);

      const getKey = Object.keys(localStorage);
      for (let i = 0; i < getKey.length; i++) {
        if (getKey[i].indexOf(time) >= 0) {
          localStorage.removeItem(getKey[i]);
        }
      }
    };

    return (
      <table>
        <thead>
          <tr>
            <th>時間</th>
            <th>品物の個数</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.time}</td>
              <td>{item.quantity}</td>
              <td>
                <Button onClick={() => { handleDelete(index, item.time); updateData(); }}>削除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const updateData = () => {
    timeArray = [];
    quantityArray = [];
    let keySplitArray: string[][] = []
    for (let i = 0; i < localStorage.length; i++) {
      keySplitArray.push(Object.keys(localStorage)[i].split(')'));
    }
    keySplitArray.sort(function (a, b) { return (Number(a[0]) - Number(b[0])); });
    for (let i = 0; i < localStorage.length; i++) {
      timeArray.unshift(keySplitArray[i][1]);
    }
    console.log(timeArray);
    for (let i = 0; i < localStorage.length; i++) {
      quantityArray.unshift(localStorage.getItem(keySplitArray[i][0] + ")" + keySplitArray[i][1]));
    }
    items = timeArray.map((time, index) => ({ time, quantity: quantityArray[index] }));
    setData(timeArray.map((time, index) => ({ time, quantity: quantityArray[index] })));

    setSellIetm(in_order_to_set_array);
    let sophisticatedQuantityArray: string[][] = [];
    let newSophisticatedQuantityArray: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      quantityArray[i] = quantityArray[i].replace(/[[\]""]/g, '');
      sophisticatedQuantityArray[i] = quantityArray[i].split(",");
    }
    newSophisticatedQuantityArray = sophisticatedQuantityArray.flat();
    console.log(newSophisticatedQuantityArray);
    for (let i = 0; i < _SellItem.length; i++) {
      _SellItem[i].quantity = 0;
    }
    // console.log(productData[0].product);
    // console.log(in_order_to_set_array);

    for (let i = 0; i < newSophisticatedQuantityArray.length; i++) {
      for (let k = 0; k < productData.length; k++) {
        if (newSophisticatedQuantityArray[i] === productData[k].product) { _SellItem[k].quantity += Number(newSophisticatedQuantityArray[i + 1]) }
      }
    }
    console.log(_SellItem);
    setSellIetm(_SellItem);
  }

  const [code, setCode] = useState('');

  // 合計金額
  let sum = 0;

  // 模擬店かどうか判別
  if (code.indexOf("焼きそば") === 0) {
    const allArray = code.split(";");// 品ごとに分割
    var nameArray: string[] = new Array(allArray.length - 1);
    var costArray: number[] = new Array(allArray.length - 1);
    var qtyArray: number[] = new Array(allArray.length - 1);
    var sumArray: number[] = new Array(allArray.length - 1);
    // それぞれの情報に分割
    for (let i = 0; i < allArray.length; i++) {
      let a = allArray[i].split(",");
      let name = a[0];
      let cost = Number(a[1]);
      let qty = Number(a[2]);
      let eachSum = Number(a[3]);
      nameArray[i] = name;
      costArray[i] = cost;
      qtyArray[i] = qty;
      sumArray[i] = eachSum;
    }

    // 合計金額を求める処理
    for (let i = 0; i < sumArray.length - 1; i++) {
      sum = sum + sumArray[i]
    }
    // console.log(sum);
  }


  // QR コード読み込み後の処理
  const onRecognizeCode = (e: string) => {
    setCode(e);
    console.log(e);
    const _code = e;

    // 模擬店かどうか判別
    if (_code.indexOf("焼きそば") === 0) {
      // 品ごとに分割
      const _allArray = _code.replace(/\s+/g, "").split(";");
      var _nameArray: string[] = new Array(_allArray.length - 1);
      var _costArray: number[] = new Array(_allArray.length - 1);
      var _qtyArray: number[] = new Array(_allArray.length - 1);
      var _sumArray: number[] = new Array(_allArray.length - 1);
      // それぞれの要素に分割
      for (let i = 0; i < _allArray.length; i++) {
        let a = _allArray[i].split(",");
        let name = a[0];
        let cost = Number(a[1]);
        let qty = Number(a[2]);
        let eachSum = Number(a[3]);
        _nameArray[i] = name;
        _costArray[i] = cost;
        _qtyArray[i] = qty;
        _sumArray[i] = eachSum;
      }

      // local strage
      // const keys  = Object.keys(localStorage);
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let hour = d.getHours().toString().padStart(2, '0');
      let minute = d.getMinutes().toString().padStart(2, '0');
      let seconds = d.getSeconds().toString().padStart(2, '0');
      let UTCtime = d.getTime().toString().slice(0, -3);
      const date = UTCtime + ")" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
      //console.log(date);

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
      let saveData: string[] = [];
      for (let i = 0; i < products.length; i++) {
        saveData.push(JSON.stringify([products[i].name, products[i].quantity]))
      }
      //localStorageに保存
      localStorage.setItem(date, saveData.join());
      console.log(date);
      console.log(saveData.join());

      timeArray = [];
      quantityArray = [];
      let keySplitArray: string[][] = []
      for (let i = 0; i < localStorage.length; i++) {
        keySplitArray.push(Object.keys(localStorage)[i].split(')'));
      }
      keySplitArray.sort(function (a, b) { return (Number(a[0]) - Number(b[0])); });
      for (let i = 0; i < localStorage.length; i++) {
        timeArray.unshift(keySplitArray[i][1]);
      }
      console.log(timeArray);
      for (let i = 0; i < localStorage.length; i++) {
        quantityArray.unshift(localStorage.getItem(keySplitArray[i][0] + ")" + keySplitArray[i][1]));
      }
      items = timeArray.map((time, index) => ({ time, quantity: quantityArray[index] }));
      setData(timeArray.map((time, index) => ({ time, quantity: quantityArray[index] })));
    }

  }

  // react-zxing の処理
  // const [qr_result, setResult] = useState(""); // テキストを出力する際(デバッグ)に利用

  const [, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(qr_result) {
      console.log(qr_result);
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
  const Page1 = () => {
    setIsVisible1(true);
    setIsVisible2(false);
    setIsVisible3(false);
    setIsVisible4(false);
    reloadPage();
    //QRコード後の処理のフラグを消すこと！
    setFlag(false);
  }
  const Page2 = () => {
    setIsVisible1(false);
    setIsVisible2(true);
    setIsVisible3(false);
    setIsVisible4(false);
    // stopScanning();
  }
  const Page3 = () => {
    setIsVisible1(false);
    setIsVisible2(false);
    setIsVisible3(true);
    setIsVisible4(false);
    // stopScanning();
  }
  const Page4 = () => {
    setIsVisible1(false);
    setIsVisible2(false);
    setIsVisible3(false);
    setIsVisible4(true);
    updateData();
    // stopScanning();
  }

  return (
    <div className="App"
      style={{
        margin: "0 10% 68px 10%",
      }}>

      {/* Page1 */}
      {isVisible1 &&
        <div id="QR">
          <h2>QR コード</h2>
          <video ref={ref}
            style={{
              width: "100%",
              borderRadius: "16px",
            }} />
          {/*
        <p>
          <span>Last result: </span>
          <span>{qr_result}</span>
        </p>
        */}
          {/* <Button variant="outlined" onClick={reloadPage}>カメラを再起動</Button> */}

          {/* <p>合計金額: {sum} 円</p> */}
        </div>
      }
      {/* Page2 */}
      {isVisible2 &&
        <div id="QRb">
          <h2>確認</h2>
          <p>合計金額: {sum} 円</p>
          <TextField
            label="入力金額" variant="outlined"
            type="number"
            onChange={(e) => setInputValue(parseInt(e.target.value) - sum)}
          />
          {/* <Button variant="outlined" onClick={Page1}>戻る</Button> */}
          <p>おつり: {inputValue} 円</p>
          <p></p>
          {/* <h2>商品一覧</h2> */}
          <Table data={products} />
        </div>
      }

      {/* Page3 */}
      {isVisible3 &&
        <div id="clalculator">
          <h2>電卓</h2>
          <CreateCal />
        </div>
      }

      {/* Page4 */}
      {isVisible4 &&
        <div id="data">
          <h2>データ</h2>
          <p>他のレジのも含めたデータ</p>
          <DataFromFirebase />
          <CSVDownloadButton1 data={_SellItem} />
          <CSVTableComponent2 data={data} />
          <ItemTable items={_SellItem} />
          <DataTable items={data} />
        </div>
      }

      {/* footer */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation>
          <BottomNavigationAction label="QR コード" icon={<QrCodeIcon />} onClick={Page1} />
          <BottomNavigationAction label="計算" icon={<ListIcon />} onClick={Page2} />
          <BottomNavigationAction label="電卓" icon={<CalculateIcon />} onClick={Page3} />
          <BottomNavigationAction label="データ" icon={<DataThresholdingIcon />} onClick={Page4} />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default App;
