import React, { useState } from 'react';
import QRReader, { QRCode } from './QRReader';
import {CreateCal} from './showCal';

import Button from '@mui/material/Button';
import { BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
import { Calculate, Clear } from '@mui/icons-material';
import { Paper} from '@mui/material';
//表の表示
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
  
  const [stopOnRecognize, setStopOnRecognize] = React.useState(true);
  const [qrParam, setQRParam] = useState({
    width: 500,
    height: 500,
    pause: true,
  });
  
  const [inputValue, setInputValue] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const handleConfirm = () => {
    setShowDialog(true);
  };
  const handleCancel = () => {
    setShowDialog(false);
  };
  const handleConfirmInput = () => {
    // Handle the input value (e.g., send it to the server)
    console.log('Input value:', inputValue);
    setShowDialog(false);
  };

  const handleCal = () =>{
    setShowCalculator(true);
  };
  const deleteCal = () =>{
    setShowCalculator(false);
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
    for (let i = 0 ; i <allArray.length ; i++){
      let a =allArray[i].split(",");
      let name = a[0];
      let cost = Number(a[1]);
      let qty = Number(a[2]);
      let eachSum = Number(a[3]);
      nameArray[i]=name;
      costArray[i]=cost;
      qtyArray[i]=qty;
      sumArray[i]=eachSum;
    }
    // console.log("↓");
    // console.log(nameArray);
    // console.log(costArray);
    // console.log(qtyArray);
    // console.log(sumArray);
    
    for(let i=0 ; i<sumArray.length-1 ; i++){
      sum =sum + sumArray[i]
    }
    //console.log(sum);
  }
 
  const onRecognizeCode = (e: QRCode) => {
    setCode(e.data);
    console.log(e.data);
    const _code = e.data;
    if (_code.indexOf("焼きそば")===0){
      console.log("客だ！！（中）");
      if (showDialog===false){
        handleConfirm();
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
      _nameArray[i]=name;
      _costArray[i]=cost;
      _qtyArray[i]=qty;
      _sumArray[i]=eachSum;
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

  return (
    <div className="App">
      <QRReader {...qrParam} gecognizeCallback={onRecognizeCode} />
      <center>
        <label>
          <input type="radio" name="rdo" value="0" onChange={(e) => setStopOnRecognize(e.target.value === "0")} checked={stopOnRecognize} />認識時に自動停止
        </label>
        <label>
          <input type="radio" name="rdo" value="1" onChange={(e) => setStopOnRecognize(e.target.value === "0")} checked={!stopOnRecognize} />認識時も処理継続
        </label>
        <Button variant="outlined" color="primary" sx={{ marginRight: 2 }} onClick={toggleVideoStream}>{(qrParam.pause? '再開': '停止')}</Button>
      </center>
      <p>QRコード: {code}</p>
      <p></p>
      <p>合計金額: {sum}</p>
      <Button variant="outlined" onClick={handleConfirm}>Open Confirmation Dialog</Button>
      {showDialog && (
        <div
        style={{
              alignItems: 'center',
              position: 'absolute',
              top: '10px',
              background:"#e8f8f8",
              zIndex: 999,
              height: "100%",
              width: "100%",
              maxWidth: "540px",
          }}
  
        className="custom-dialog">
          <h1>Confirmation</h1>
          <input
            type="number"
            onChange={(e) => setInputValue(parseInt(e.target.value)-sum)}
          />
          <Button variant="outlined" onClick={handleCancel}>戻る</Button>
          <Button variant="outlined" onClick={handleConfirmInput}>Confirm</Button>
          <p>合計金額: {sum}</p>
          <p>おつり: {inputValue}</p>
          <p></p>
          <div>
            <h1>商品一覧</h1>
            <Table data={products} />
          </div> 
        </div>
      )}
      
      <Button variant="outlined" onClick={handleCal}>電卓</Button>
      {showCalculator && (
        <div
        style={{
              alignItems: 'center',
              position: 'absolute',
              top: '10px',
              background:"#eff",
              zIndex: 999,
              height: "100%",
              width: "100%",
              maxWidth: "540px",
          }}
  
        className="custom-dialog">
          <Paper sx={{fontSize: "50px", background:"#dff" , position: 'relative', top: 0, left: 0, right: 0 }} elevation={3}>
            電卓<IconButton sx={{float:"right",fontSize:"large"}}  onClick={deleteCal}><Clear /></IconButton> 
          </Paper>
          <CreateCal />
        </div>
      )}
       <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation>
        <BottomNavigationAction label ="電卓" icon={< Calculate/>} onClick={handleCal}/>
      </BottomNavigation>
      </Paper>
    </div>
  );
}

export default App;
