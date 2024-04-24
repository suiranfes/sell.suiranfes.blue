import React, { useState } from 'react';
import QRReader, { QRCode } from './QRReader';
import {CreateCal} from './showCal';

import Button from '@mui/material/Button';
import { BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
import { Calculate, Clear } from '@mui/icons-material';
import { Paper} from '@mui/material';
import { sortAndDeduplicateDiagnostics } from 'typescript';
//表の表示
let products = [
  { name: '商品1', quantity: 5 },
  { name: '商品2', quantity: 10 },
  { name: '商品3', quantity: 3 },
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

  const [stopOnRecognize, setStopOnRecognize] = React.useState(true);
  const [qrParam, setQRParam] = useState({
    wtimeth: 500,
    height: 500,
    pause: true,
  });
  
  const [inputValue, setInputValue] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showData, setShowData] = useState(false);
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
  const handleData = () =>{
    setShowData(true);
  };
  const deleteCal = () =>{
    setShowCalculator(false);
  };
  const deleteData = () =>{
    setShowData(false);
  };
  interface SellItem {
    item: string;
    quantity: number;
  }
  const [SellItem,setSellIetm] =useState<SellItem[]>([{item:"焼きそば",quantity:0},{item:"フランクフルト",quantity:0},{item:"チュロス",quantity:0},{item:"クレープ",quantity:0},{item:"チョコバナナ",quantity:0},{item:"つぶつぶアイス",quantity:0},
  {item:"かき氷",quantity:0},{item:"肉巻きおにぎり",quantity:0},{item:"ドリンク",quantity:0},{item:"ペットボトル",quantity:0}
  ]);

  interface Item {
    time: string;
    quantity: string;
  }
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
      if(newSophisticatedQuantityArray[i]=="焼きそば"){SellItem[0].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="フランクフルト"){SellItem[1].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="チュロス"){SellItem[2].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="クレープ"){SellItem[3].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="チョコバナナ"){SellItem[4].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="つぶつぶアイス"){SellItem[5].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="かき氷"){SellItem[6].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="肉巻きおにぎり"){SellItem[7].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="ドリンク各種"){SellItem[8].quantity+=Number(newSophisticatedQuantityArray[i+1])}
      if(newSophisticatedQuantityArray[i]=="ペットボトル"){SellItem[9].quantity+=Number(newSophisticatedQuantityArray[i+1])}
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
    {item:"ペットボトル",quantity:SellItem[9].quantity}]);
  }

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
      // // ローカルストレージに値を保存する
      // //localStorage.setItem("key", "valueeeeeeeeeeeeeeeeeeeeeeeeee");

      // // ローカルストレージから値を取得する
      // const value = localStorage.getItem("key");
      // console.log(value);
      // //localStorage.removeItem("key");
      // const value1 = localStorage.getItem("key");
      // console.log(value1);
      console.log("客だ！！（中）");
      if (showDialog===false){
        handleConfirm();
      }
      
      const _allArray = _code.replace(/\s+/g, "").split(";");
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
      const keys  = Object.keys(localStorage);


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
    }
    


    if (stopOnRecognize) {
      setQRParam( e => { return {...e, pause: true}; });
    }
  }

  const toggleVtimeeoStream = () => {
    setQRParam( e => { return {...e, pause: !e.pause}; });
  }
  const ClearLocalStorage = () => {
    localStorage.clear();
  }

  return (
    <div className="App">
      <QRReader {...qrParam} gecognizeCallback={onRecognizeCode} />
      
        {/* <label>
          <input type="radio" name="rdo" value="0" onChange={(e) => setStopOnRecognize(e.target.value === "0")} checked={stopOnRecognize} />認識時に自動停止
        </label>
        <label>
          <input type="radio" name="rdo" value="1" onChange={(e) => setStopOnRecognize(e.target.value === "0")} checked={!stopOnRecognize} />認識時も処理継続
        </label> */}
        <Button variant="outlined" color="primary" sx={{ marginRight: 2 }} onClick={toggleVtimeeoStream}>{(qrParam.pause? '再開': '停止')}</Button>
    
      {/* <p>QRコード: {code}</p> */}
      <p></p>
      <p>合計金額: {sum}</p>

      <Button variant="outlined" onClick={handleConfirm}>Open Confirmation Dialog</Button>
      {showDialog && (
        <div
        style={{
              border: "soltime 2px #090e0f",
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
            <Button onClick={ClearLocalStorage}>LocalStorageをクリア</Button>
          </div> 
        </div>
      )}
      
      <Button variant="outlined" onClick={handleCal}>電卓</Button>
      {showCalculator && (
        <div
        style={{
              border: "soltime 2px #090e0f",
              alignItems: 'center',
              position: 'absolute',
              top: '10px',
              background:"#e8e868",
              zIndex: 999,
              height: "100%",
              width: "100%",
              maxWidth: "540px",
          }}
  
        className="custom-dialog">
          <Paper sx={{fontSize: "50px", background:"#ffcfff" , position: 'relative', top: 0, left: 0, right: 0 }} elevation={3}>
            電卓<IconButton sx={{float:"right",fontSize:"large"}}  onClick={deleteCal}><Clear /></IconButton> 
          </Paper>
          <CreateCal />
        </div>
      )}
      <Button variant="outlined" onClick={handleData}>データ</Button>
      {showData && (
        <div
        style={{
              border: "soltime 2px #090e0f",
              alignItems: 'center',
              position: 'absolute',
              top: '10px',
              background:"#e8e868",
              zIndex: 999,
              height: "100%",
              width: "100%",
              maxWidth: "540px",
          }}
  
        className="custom-dialog">
          <Paper sx={{fontSize: "50px", background:"#ffcfff" , position: 'relative', top: 0, left: 0, right: 0 }} elevation={3}>
            データ<IconButton sx={{float:"right",fontSize:"large"}}  onClick={deleteData}><Clear /></IconButton> 
          </Paper>
           <button onClick={updateData}>更新</button>
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
