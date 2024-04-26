import { useState } from 'react';
import { useZxing } from 'react-zxing';
import { CreateCal } from './showCal';

import { Paper } from '@mui/material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import Button from '@mui/material/Button';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import ListIcon from '@mui/icons-material/List';
import CalculateIcon from '@mui/icons-material/Calculate';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
// import { sortAndDeduplicateDiagnostics } from 'typescript';

// Default Data
let products = [
  { name: '', quantity: 0 },
];

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

function App() {
  let timeArray: string[] = ["9:00", "10:00", "11:00"]; // 時間の配列
  let quantityArray: string[] = ["3", "5", "2"]; // 品物の個数の配列
  let items: Item[] = timeArray.map((time, index) => ({ time, quantity: quantityArray[index] }));
  // const [qrParam, setQRParam] = useState({
  //   wtimeth: 500,
  //   height: 500,
  //   pause: true,
  // });
  // 入力したお金 (後の処理でお釣りを求める)
  const [inputValue, setInputValue] = useState(0);
  // Page2 を表示
  const [, setShowDialog] = useState(false);
  // const [showDialog, setShowDialog] = useState(false);
  // const [showCalculator, setShowCalculator] = useState(false);
  // const [showData, setShowData] = useState(false);
  // const handleConfirm = () => {
  //   setShowDialog(true);
  // };
  // const handleCancel = () => {
  //   setShowDialog(false);
  // };
  // 入力金額の確認
  const handleConfirmInput = () => {
    console.log('Input value:', inputValue);
    setShowDialog(false);
  };

  interface Item {
    time: string;
    quantity: string;
  }
  interface SellItem {
    item: string;
    quantity: number;
  }
  const [SellItem,setSellIetm] = useState<SellItem[]>([{item:"焼きそば",quantity:0},{item:"フランクフルト",quantity:0},{item:"チュロス",quantity:0},{item:"クレープ",quantity:0},{item:"チョコバナナ",quantity:0},{item:"つぶつぶアイス",quantity:0},
  {item:"かき氷",quantity:0},{item:"肉巻きおにぎり",quantity:0},{item:"ドリンク",quantity:0},{item:"ペットボトル",quantity:0}
  ]);
  const [data, setData] = useState<Item[]>(items);
  const DataTable: React.FC<{ items: Item[] }> = ({ items }) => {
    const handleDelete = (index: number,time: string) => {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);

      const getKey = Object.keys(localStorage);
      for(let i=0;i<getKey.length;i++){
        if(getKey[i].indexOf(time)>=0){
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
                <button onClick={() => handleDelete(index,item.time)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const updateData = () => {
    timeArray =[];
    quantityArray=[];
    let keySplitArray:string[][]=[]
    for (let i=0 ; i<localStorage.length;i++){
      keySplitArray.push(Object.keys(localStorage)[i].split(')'));
    }
    keySplitArray.sort(function(a,b){return(Number(a[0]) - Number(b[0]));});
    for (let i=0;i<localStorage.length;i++){
      timeArray.unshift(keySplitArray[i][1]);
    }
    console.log(timeArray);
    for(let i=0;i<localStorage.length;i++){
      quantityArray.unshift(localStorage.getItem(keySplitArray[i][0]+")"+keySplitArray[i][1]));
    }
    items = timeArray.map((time, index) => ({ time, quantity: quantityArray[index] }));
    setData(timeArray.map((time, index) => ({ time, quantity: quantityArray[index] })));
    
    setSellIetm([{item:"焼きそば",quantity:0},{item:"フランクフルト",quantity:0},{item:"チュロス",quantity:0},{item:"クレープ",quantity:0},{item:"チョコバナナ",quantity:0},{item:"つぶつぶアイス",quantity:0},
    {item:"かき氷",quantity:0},{item:"肉巻きおにぎり",quantity:0},{item:"ドリンク",quantity:0},{item:"ペットボトル",quantity:0}
    ]);

    let sophisticatedQuantityArray:string[][]=[];
    let newSophisticatedQuantityArray:string[]=[];
    for(let i=0;i<localStorage.length;i++){
      quantityArray[i]=quantityArray[i].split("[").join();
      quantityArray[i]=quantityArray[i].split("]").join();
      quantityArray[i]=quantityArray[i].split(/"/).join();
      quantityArray[i]=quantityArray[i].split(/"/).join();
      quantityArray[i]=quantityArray[i].split(",,").join();
      quantityArray[i]=quantityArray[i].split(",,").join();
      sophisticatedQuantityArray[i]=quantityArray[i].split(",");
    }
    newSophisticatedQuantityArray=sophisticatedQuantityArray.flat();
    console.log(newSophisticatedQuantityArray);
    for(let i = 0;i<SellItem.length;i++){
      SellItem[i].quantity=0;
    }
      
    for (let i=0;i<newSophisticatedQuantityArray.length;i++){
      if(newSophisticatedQuantityArray[i]==="焼きそば"){SellItem[0].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="フランクフルト"){SellItem[1].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="チュロス"){SellItem[2].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="クレープ"){SellItem[3].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="チョコバナナ"){SellItem[4].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="つぶつぶアイス"){SellItem[5].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="かき氷"){SellItem[6].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="肉巻きおにぎり"){SellItem[7].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="ドリンク各種"){SellItem[8].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]==="ペットボトル"){SellItem[9].quantity+=Number(newSophisticatedQuantityArray[i+1])}
    }
    console.log(SellItem[0].quantity);
    setSellIetm([
      {item:"焼きそば",quantity:SellItem[0].quantity},
      {item:"フランクフルト",quantity:SellItem[1].quantity},
      {item:"チュロス",quantity:SellItem[2].quantity},
      {item:"クレープ",quantity:SellItem[3].quantity},
      {item:"チョコバナナ",quantity:SellItem[4].quantity},
      {item:"つぶつぶアイス",quantity:SellItem[5].quantity},
      {item:"かき氷",quantity:SellItem[6].quantity},
      {item:"肉巻きおにぎり",quantity:SellItem[7].quantity},
      {item:"ドリンク",quantity:SellItem[8].quantity},
      {item:"ペットボトル",quantity:SellItem[9].quantity}
    ]);
  }

  const [code, setCode] = useState('');

  // 合計金額
  let sum = 0;

  // 模擬店かどうか判別
  if (code.indexOf("焼きそば") === 0){
    const allArray = code.split(";");// 品ごとに分割
    var nameArray:string[]=new Array( allArray.length-1 );
    var costArray:number[]=new Array( allArray.length-1 );
    var qtyArray:number[]=new Array( allArray.length-1 );
    var sumArray:number[]=new Array( allArray.length-1 );  
    // それぞれの情報に分割
    for (let i = 0; i < allArray.length; i++){
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
    for(let i = 0; i < sumArray.length-1; i++){
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
    if (_code.indexOf("焼きそば") === 0){
      // // ローカルストレージに値を保存する
      // //localStorage.setItem("key", "valueeeeeeeeeeeeeeeeeeeeeeeeee");

      // // ローカルストレージから値を取得する
      // const value = localStorage.getItem("key");
      // console.log(value);
      // //localStorage.removeItem("key");
      // const value1 = localStorage.getItem("key");
      // console.log(value1);
      // 品ごとに分割
      const _allArray = _code.replace(/\s+/g, "").split(";");
      var _nameArray:string[]=new Array( _allArray.length - 1 );
      var _costArray:number[]=new Array( _allArray.length - 1 );
      var _qtyArray:number[]=new Array( _allArray.length - 1 );
      var _sumArray:number[]=new Array( _allArray.length - 1 );  
      // それぞれの要素に分割
      for (let i = 0; i < _allArray.length; i++){
        let a =_allArray[i].split(",");
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
      let UTCtime = d.getTime().toString().slice(0,-3);
      const date =  UTCtime+")"+year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;  
      //console.log(date);

      //表示する商品
      products = [];
      for(let i = 0; i < _nameArray.length - 1; i++){
        if(_qtyArray[i] !== 0){
          products.push(
            {
              name: _nameArray[i],
              quantity: _qtyArray[i]
            }
          );
        }
      }
      let saveData:string[]=[];
      for(let i= 0;i<products.length;i++){
          saveData.push(JSON.stringify([products[i].name,products[i].quantity]))
      }
      //localStorageに保存
      localStorage.setItem(date,saveData.join());
      console.log(date);
      console.log(saveData.join());
      
      timeArray =[];
      quantityArray=[];
      let keySplitArray:string[][]=[]
      for (let i = 0;i < localStorage.length;i++){
        keySplitArray.push(Object.keys(localStorage)[i].split(')'));
      }
      keySplitArray.sort(function(a,b){return(Number(a[0]) - Number(b[0]));});
      for (let i = 0;i < localStorage.length;i++){
        timeArray.unshift(keySplitArray[i][1]);
      }
      console.log(timeArray);
      for (let i = 0;i < localStorage.length;i++){
        quantityArray.unshift(localStorage.getItem(keySplitArray[i][0]+")"+keySplitArray[i][1]));
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
      const outputText = qr_result.getText();

      onRecognizeCode(outputText); // 結果を渡す
      setResult(outputText);
      Page2(); // Page2 を開く
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
        <Button variant="outlined" onClick={reloadPage}>カメラを再起動</Button>

        {/* <p>合計金額: {sum} 円</p> */}
      </div>
      }
      {/* Page2 */}
      {isVisible2 &&
      <div id="QRb">
        <h2>確認</h2>
          <input
            type="number"
            onChange={(e) => setInputValue(parseInt(e.target.value)-sum)}
          />
          <Button variant="outlined" onClick={Page1}>戻る</Button>
          <Button variant="outlined" onClick={handleConfirmInput}>確認</Button>
          <p>合計金額: {sum} 円</p>
          <p>おつり: {inputValue} 円</p>
          <p></p>
          <div>
            <h2>商品一覧</h2>
            <Table data={products} />
          </div> 
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
          <table>
            <thead>
              <tr>
                <th>焼きそば</th><th>フランクフルト</th><th>チュロス</th><th>クレープ</th><th>チョコバナナ</th>
                <th>つぶつぶアイス</th><th>かき氷</th><th>肉巻きおにぎり</th><th>ドリンク各種</th><th>ペットボトル</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{SellItem[0].quantity}</td><td>{SellItem[1].quantity}</td><td>{SellItem[2].quantity}</td><td>{SellItem[3].quantity}</td>
                <td>{SellItem[4].quantity}</td><td>{SellItem[5].quantity}</td><td>{SellItem[6].quantity}</td><td>{SellItem[7].quantity}</td>
                <td>{SellItem[8].quantity}</td><td>{SellItem[9].quantity}</td>
              </tr>
            </tbody>
          </table>
        <DataTable items={items}/>        
      </div>      
      }

      {/* footer */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation>
          <BottomNavigationAction label ="QR コード" icon={<QrCodeIcon />} onClick={Page1}/>
          <BottomNavigationAction label ="計算" icon={<ListIcon />} onClick={Page2}/>
          <BottomNavigationAction label ="電卓" icon={<CalculateIcon />} onClick={Page3}/>
          <BottomNavigationAction label ="データ" icon={<DataThresholdingIcon />} onClick={Page4}/>
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default App;
