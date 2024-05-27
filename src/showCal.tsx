import React, { useState } from 'react';
import { productData } from './data';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Icons
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';

export const columns = [
  { Header: "商品", accessor: "product" },
  { Header: "値段", accessor: "price" }
];

interface Item {
  product: string;
  price: number;
  quantity: number;
}

const _productData: Item[] = productData.map((data) => {
  const one_of_productData = {
    ...data,
    price: Number(data.price),
    quantity: 0
  }
  return one_of_productData;
});

const ItemTable: React.FC<{ items: Item[] }> = ({ items }) => {
  const [itemList, setItemList] = useState<Item[]>(items.map(item => ({ ...item, quantity: 0 })));
  const [_sum, setSum] = useState<number>(0);
  const [_inputValue, set_InputValue] = useState("");
  const [change, setchange] = useState(0);

  const decreaseQuantity = (index: number) => {
    const updatedList = [...itemList];
    updatedList[index].quantity = Math.max(0, updatedList[index].quantity - 1);
    setItemList(updatedList);
    calculateSum(updatedList);
    if(isNaN(parseInt(_inputValue))){
      setchange(0);
    }else{
      setchange(parseInt(_inputValue) - calculateSum(updatedList));
    }
  };

  const increaseQuantity = (index: number) => {
    const updatedList = [...itemList];
    updatedList[index].quantity++;
    setItemList(updatedList);
    calculateSum(updatedList);
    if(isNaN(parseInt(_inputValue))){
      setchange(0);
    }else{
      setchange(parseInt(_inputValue) - calculateSum(updatedList));
    }
  };

  const calculateSum = (items: Item[]) => {
    let sum = 0;
    items.forEach(item => {
      sum += item.quantity * item.price;
    });
    setSum(sum);
    return(sum);
  };

  const setLocalStorage = () => {
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
    let saveData: string[] = [];
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].quantity !== 0) {
        saveData.push(JSON.stringify([itemList[i].product, itemList[i].quantity]))
      }
    }
    //localStorageに保存
    localStorage.setItem(date, saveData.join());
    const keys = Object.keys(localStorage);
    console.log(date);
    console.log(keys);
    console.log(localStorage.getItem(date))
  }
  // const deleteLocalStorage = () => {
  //   localStorage.clear();
  //   const keys = Object.keys(localStorage);
  //   console.log(keys);
  // }
  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_InputValue(e.target.value);
    if(isNaN(parseInt(e.target.value))){
      setchange(0);
    }else{
      setchange(parseInt(e.target.value) - _sum);
    }  
  };

  const deleteData = () => {
    setItemList(items.map(item => ({ ...item, quantity: 0 })));
    setSum(0);
    set_InputValue("");
    setchange(0);
  }

  // const returnChange = () => {
  //   if(isNaN(parseInt(_inputValue))){
  //     return(0);
  //   }else{
  //     return(parseInt(_inputValue) - _sum);
  //   }
  // }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>品物名</th>
            <th>減らす</th>
            <th>個数</th>
            <th>増やす</th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item, index) => (
            <tr key={index}>
              <td>{item.product}</td>
              <td>
                <Button variant="outlined" onClick={() => decreaseQuantity(index)}>-</Button>
              </td>
              <td align='center'>{item.quantity}</td>
              <td>
                <Button variant="outlined" onClick={() => increaseQuantity(index)}>+</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p></p>
      <p>合計: {_sum} 円</p>
      <TextField
        label="入力金額" variant="outlined"
        type="number"
        value={_inputValue}
        onChange={handleInputValueChange}
      />
      <p>おつり: {change} 円</p>
      <Button onClick={deleteData} endIcon={<DeleteForeverIcon />}>データを消す</Button>|{/*左の縦棒はあえて*/}
      <Button onClick={setLocalStorage} endIcon={<CheckIcon />}>データを保存</Button>
      {/* <Button onClick={deleteLocalStorage}>データを消す (開発者向け)</Button> */}
    </div>
  );
};

const CreateCal = () => {
  return (
    <ItemTable items={_productData} />
  );
}

export { CreateCal };
