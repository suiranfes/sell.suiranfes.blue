import React, { useState } from 'react';
import QRReader, { QRCode } from './QRReader';
import { CreateCal } from './showCal';

import { Paper } from '@mui/material';
import { BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import ListIcon from '@mui/icons-material/List';
import CalculateIcon from '@mui/icons-material/Calculate';

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
  const [stopOnRecognize] = React.useState(true);
  const [qrParam, setQRParam] = useState({
    width: 500,
    height: 500,
    pause: true,
  });

  const [inputValue, setInputValue] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const handleConfirmInput = () => {
    // Handle the input value (e.g., send it to the server)
    console.log('Input value:', inputValue);
    setShowDialog(false);
  };

  const [code, setCode] = useState('');
  //console.log(code);
  //ここから変更

  let sum =0;
  if (code.indexOf("焼きそば")===0){
    //console.log("客だ！！(外)");
    
    const allArray = code.split(";");
    //console.log(allArray);
    var nameArray:string[]=new Array( allArray.length-1 );
    var costArray:number[]=new Array( allArray.length-1 );
    var qtyArray:number[]=new Array( allArray.length-1 );
    var sumArray:number[]=new Array( allArray.length-1 );  
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
    // console.log("↓");
    // console.log(nameArray);
    // console.log(costArray);
    // console.log(qtyArray);
    // console.log(sumArray);
    
    for(let i = 0; i < sumArray.length-1; i++){
      sum = sum + sumArray[i]
    }
    //console.log(sum);
  }
 
  const onRecognizeCode = (e: QRCode) => {
    setCode(e.data);
    console.log(e.data);
    const _code = e.data;
    if (_code.indexOf("焼きそば")===0){
      console.log("客だ！！（中）");
      if (showDialog === false){
        Page2();
      }

      const _allArray = _code.split(";");
      //console.log(allArray);
      var _nameArray:string[]=new Array( _allArray.length-1 );
      var _costArray:number[]=new Array( _allArray.length-1 );
      var _qtyArray:number[]=new Array( _allArray.length-1 );
      var _sumArray:number[]=new Array( _allArray.length-1 );  
      for (let i = 0 ; i <_allArray.length ; i++){
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

      //表示する商品
      products = [];
      for(let i=0 ; i<_nameArray.length-1 ; i++){
        if(_qtyArray[i]!==0){
          products.push(
            {
              name:_nameArray[i],
              quantity: _qtyArray[i]
            }
          );
        }
      }
    }

    if (stopOnRecognize) {
      setQRParam( e => { return {...e, pause: true}; });
    }
  }

  const toggleVideoStream = () => {
    setQRParam( e => { return {...e, pause: !e.pause}; });
  }

  const [isVisible1, setIsVisible1] = useState<boolean>(true);
  const [isVisible2, setIsVisible2] = useState<boolean>(false);
  const [isVisible3, setIsVisible3] = useState<boolean>(false);
  const Page1 = () => {
    setIsVisible1(true);
    setIsVisible2(false);
    setIsVisible3(false);
  }
  const Page2 = () => {
    setIsVisible1(false);
    setIsVisible2(true);
    setIsVisible3(false);
  }
  const Page3 = () => {
    setIsVisible1(false);
    setIsVisible2(false);
    setIsVisible3(true);
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
        <QRReader {...qrParam} gecognizeCallback={onRecognizeCode} />
        <Button variant="outlined" color="primary" sx={{ marginRight: 2 }} onClick={toggleVideoStream}>{(qrParam.pause? '読み込み再開': '読み込み停止')}</Button>
        <p>合計金額: {sum} 円</p>
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
      
      {/* footer */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation>
          <BottomNavigationAction label ="QR コード" icon={<QrCodeIcon />} onClick={Page1}/>
          <BottomNavigationAction label ="計算" icon={<ListIcon />} onClick={Page2}/>
          <BottomNavigationAction label ="電卓" icon={<CalculateIcon />} onClick={Page3}/>
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default App;
