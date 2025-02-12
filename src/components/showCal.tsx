import React, { useState } from 'react';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Material Icons
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

//GSsheet
import { reflectLocal } from './localToGSsheet';
import { IconButton } from '@mui/material';

// eslint-disable-next-line react-refresh/only-export-components
export const columns = [
  { Header: "商品", accessor: "product" },
  { Header: "値段", accessor: "price" }
];

interface Item {
  product: string;
  price: number;
  quantity: number;
}

const ItemTable: React.FC<{ items: Item[] }> = ({ items }) => {
  // console.log(items);
  // const [itemList, setItemList] = useState<Item[]>(items.map(item => ({ ...item, quantity:0 })));
  const [itemList, setItemList] = useState<Item[]>(items);
  let sum1 = 0;
  items.forEach(item => {
    sum1 += item.quantity * item.price;
  });
  // console.log(sum1);
  const [_sum, setSum] = useState<number>(sum1);
  const [_inputValue, set_InputValue] = useState("");
  const [change, setchange] = useState(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);


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

  const setLocalStorage = () => {
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);//GASにいっぱいリクエストするとGASが死ぬ
    }, 1500);
    if (localStorage.getItem("isUser") == "false" || localStorage.getItem("isUser") == null) {
      alert("ユーザーページからログインしてください");
      return;
    }
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours().toString().padStart(2, '0');
    const minute = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const UTCtime = d.getTime().toString().slice(0, -3);
    const date = UTCtime + ")" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
    // console.log(date);
    const saveData: string[] = [];
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].quantity !== 0) {
        saveData.push(JSON.stringify([itemList[i].product, itemList[i].quantity]))
      }
    }
    //localStorageに保存
    localStorage.setItem(date, saveData.join());
    reflectLocal();
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
    setItemList(items.map(item => ({ ...item, quantity: 0 })));
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
      {/* <Button onClick={deleteLocalStorage}>データを消す (開発者向け)</Button> */}
    </div>
  );
};

const CreateCal: React.FC<{ data: Item[] }> = ({ data }) => {
  return (
    <div>
      <h2>電卓</h2>
      <ItemTable items={data} />
    </div>
  );
}

export { CreateCal };
