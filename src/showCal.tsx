import { Button } from '@mui/material';
import React, { useState } from 'react';

export const columns = [
    { Header: "商品", accessor: "product" },
    { Header: "値段", accessor: "price" }
  ];
  
  export const productData = [
    {product: "焼きそば",      price: "350"},
    {product: "フランクフルト",price: "200"},
    {product: "肉巻きおにぎり",price: "350"},
    {product: "チュロス",      price: "250"},
    {product: "かき氷",        price: "200"},
    {product: "チョコバナナ",  price: "300"},
    {product: "つぶつぶアイス",price: "350"},
    {product: "クレープ",      price: "300"},
    {product: "ドリンク各種",  price: "300"},
    {product: "ペットボトル",  price: "150"}
  ];

  interface Item {
    product: string;
    price: number;
    quantity: number;
  }

  const _productData: Item[] = [
    {product: "焼きそば",      price: 350, quantity:0},
    {product: "フランクフルト",price: 200, quantity:0},
    {product: "肉巻きおにぎり",price: 350, quantity:0},
    {product: "チュロス",      price: 250, quantity:0},
    {product: "かき氷",        price: 200, quantity:0},
    {product: "チョコバナナ",  price: 300, quantity:0},
    {product: "つぶつぶアイス",price: 350, quantity:0},
    {product: "クレープ",      price: 300, quantity:0},
    {product: "ドリンク各種",  price: 300, quantity:0},
    {product: "ペットボトル",  price: 150, quantity:0}
  ]
  
  const ItemTable: React.FC<{ items: Item[] }> = ({ items }) => {
    const [itemList, setItemList] = useState<Item[]>(items.map(item => ({ ...item, quantity: 0 })));
    const [_sum, setSum] = useState<number>(0);
    const [_inputValue, set_InputValue] = useState(0);
    
    const decreaseQuantity = (index: number) => {
      const updatedList = [...itemList];
      updatedList[index].quantity = Math.max(0, updatedList[index].quantity - 1);
      setItemList(updatedList);
      calculateSum(updatedList);
    };
  
    const increaseQuantity = (index: number) => {
      const updatedList = [...itemList];
      updatedList[index].quantity++;
      setItemList(updatedList);
      calculateSum(updatedList);
    };
    
    const calculateSum = (items: Item[]) => {
      let sum = 0;
      items.forEach(item => {
          sum += item.quantity * item.price;
      });
      setSum(sum);
  };
    
  const setLocalStorage = () => {
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let hour = d.getHours().toString().padStart(2, '0');
      let minute = d.getMinutes().toString().padStart(2, '0');
      let seconds = d.getSeconds().toString().padStart(2, '0');
      let UTCtime = d.getTime().toString().slice(0,-3);
      const date = UTCtime+")"+year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;  
      //console.log(date);
      let saveData:string[]=[];
      for(let i= 0;i<itemList.length;i++){
        if(itemList[i].quantity !== 0){
          saveData.push(JSON.stringify([itemList[i].product,itemList[i].quantity]))
        } 
      }
      //localStorageに保存
      localStorage.setItem(date,saveData.join());
      const keys  = Object.keys(localStorage);
      console.log(date);
      console.log(keys);
      console.log(localStorage.getItem(date))
    }
    const deleteLocalStorage = () => {
      localStorage.clear();
      const keys  = Object.keys(localStorage);
      console.log(keys);
    }

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
        <input 
          type="number"
          onChange={(e) => set_InputValue(parseInt(e.target.value)-_sum)}
        />
        <p>合計: {_sum}</p>
        <p>おつり: {_inputValue}</p>
        <Button onClick={setLocalStorage}>データを保存</Button>
        <Button onClick={deleteLocalStorage}>データを消す (開発者向け)</Button>
      </div>
    );
  };
  
  // Example usage:
  // const ExampleComponent: React.FC = () => {
  //   const initialItems: Item[] = [
  //    { name: 'Item 1' },
  //    { name: 'Item 2' },
  //    { name: 'Item 3' },
  //    { name: 'Item 4' },
  //    { name: 'Item 5' },
  //   ];
  
  //   return <ItemTable items={initialItems} />;
  // };
  
const CreateCal = ()=>{
  return(
      <ItemTable items={_productData} />
  );
}
export{CreateCal};
