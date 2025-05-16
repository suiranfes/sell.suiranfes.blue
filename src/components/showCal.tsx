import React, { useEffect, useState } from 'react';

// Material UI/Icons
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

//GSsheet
import { writeToSheet } from './SheetOperater';
import { productData } from './data';

// eslint-disable-next-line react-refresh/only-export-components
export const columns = [
  { Header: "商品", accessor: "product" },
  { Header: "値段", accessor: "price" }
];

interface QrItem {
  name: string;
  quantity: number;
}

interface Item {
  product: string;
  price: number;
  quantity: number;
}

const ItemTable: React.FC<{ qrItems: { name: string; quantity: number }[] }> = ({ qrItems }) => {
  const [itemList, setItemList] = useState<Item[]>(
    productData.map(value => ({
    product: value.product,
    price: Number(value.price),
    quantity: 0
  })));
  const [_sum, setSum] = useState<number>(0);
  const [_inputValue, set_InputValue] = useState("");
  const [change, setchange] = useState(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  //初期化
  useEffect(() => {
    const initializedList: Item[] = productData.map(value => {
      const matched = qrItems.find(q => q.name === value.product);
      return {
        product: value.product,
        price: Number(value.price),
        quantity: matched ? matched.quantity : 0
      };
    });
  setItemList(initializedList);
  },[qrItems])
  //itemListを監視してsumを計算
  useEffect(() => {
  const total = itemList.reduce((acc, item) => acc + item.price * item.quantity, 0);
  setSum(total);
  setchange(isNaN(parseInt(_inputValue)) ? 0 : parseInt(_inputValue) - total);
}, [itemList]);
  
  // console.log(sum1);
  const decreaseQuantity = (index: number) => {
    const updatedList = [...itemList];
    updatedList[index].quantity = Math.max(0, updatedList[index].quantity - 1);
    setItemList(updatedList);
    calculateSum(updatedList);
    if (isNaN(parseInt(_inputValue))) {
      setchange(0);
    } else {
      setchange(parseInt(_inputValue) - calculateSum(updatedList));
    }
  };

  const increaseQuantity = (index: number) => {
    const updatedList = [...itemList];
    updatedList[index].quantity++;
    setItemList(updatedList);
    calculateSum(updatedList);
    if (isNaN(parseInt(_inputValue))) {
      setchange(0);
    } else {
      setchange(parseInt(_inputValue) - calculateSum(updatedList));
    }
  };

  const calculateSum = (items: Item[]) => {
    let sum = 0;
    items.forEach(item => {
      sum += item.quantity * item.price;
    });
    setSum(sum);
    return (sum);
  };

  const setLocalStorage = async () => {
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 1500);
    if (localStorage.getItem("isUser") == "false" || localStorage.getItem("isUser") == null) {
      alert("ユーザーページからログインしてください");
      return;
    } else if(itemList.every(value => value.quantity == 0) ){
      alert("全ての項目が0個です");
      return;
    }

    const now = new Date();
    const date = `${now.getFullYear()}/${(now.getMonth()+1)
    .toString().padStart(2, '0')}/${now.getDate()
    .toString().padStart(2, '0')} ${now.getHours()
    .toString().padStart(2, '0')}:${now.getMinutes()
    .toString().padStart(2, '0')}:${now.getSeconds()
    .toString().padStart(2, '0')}.${now.getMilliseconds()
    .toString().padStart(3, '0')}`;
    const saveProductData: string[][] = [];
    const GSheetValues:Record<string, string> = {};
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].quantity !== 0) {
        const _product = itemList[i].product;
        const _quantity = itemList[i].quantity.toString();
        GSheetValues[_product] = _quantity;
        const row = [_product, _quantity];
        saveProductData.push(row);
      }
    }
  
    const writed = await writeToSheet(GSheetValues, date);
    const saveDate = {
      data:saveProductData,
      synced:writed
    } 
    
    //localStorageに保存
    localStorage.setItem(date, JSON.stringify(saveDate));
  }

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_InputValue(e.target.value);
    if (isNaN(parseInt(e.target.value))) {
      setchange(0);
    } else {
      setchange(parseInt(e.target.value) - _sum);
    }
  };

  const deleteData = () => {
    // if (window.confirm("本当に削除しますか？") === true) {
    setItemList(itemList.map(item => ({ ...item, quantity: 0 })));
    setSum(0);
    set_InputValue("");
    setchange(0);
    // }
  }

  return (
    <div>
      <p>
        <Button variant="outlined" onClick={deleteData} endIcon={<DeleteForeverIcon />}>データを消す</Button>
      </p>
      <TableContainer sx={{ maxWidth: 500 }} component={Paper}>
        <Table size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>商品名</TableCell>
              <TableCell align="center">個数&nbsp;(個)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemList.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item.product}
                </TableCell>
                <TableCell align="center">
                  <IconButton color='primary' onClick={() => decreaseQuantity(index)}>
                    <RemoveIcon />
                  </IconButton>
                  {item.quantity}
                  <IconButton color='primary' onClick={() => increaseQuantity(index)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p>合計: {_sum} 円</p>
      <TextField
        label="入力金額" variant="outlined"
        type="number"
        value={_inputValue}
        onChange={handleInputValueChange}
      />
      <p>おつり: {change} 円</p>
      <p>
        <Button variant="outlined" onClick={setLocalStorage} endIcon={<CheckIcon />} disabled={isDisabled}>データを保存</Button>
      </p>
      {/* <Button onClick={localStorage.clear}>データを消す (開発者向け)</Button> */}
    </div>
  );
};

const CreateCal: React.FC<{ qrItems: QrItem[] }> = ({ qrItems }) => {
  return (
    <div>
      <h2>電卓</h2>
      <ItemTable qrItems={qrItems}/>
    </div>
  );
}

export { CreateCal };
