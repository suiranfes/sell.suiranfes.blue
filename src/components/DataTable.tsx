import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from '@mui/icons-material';

import { LocalStorageLib } from "./localStorageLib";
const localStorageLib = new LocalStorageLib();
import { deleteRowFromSheet } from "./SheetOperater";
import { useEffect, useState } from "react";

interface Item {
  time: string;
  quantity: string;
  synced: boolean;
}

export const DataTable: React.FC<{}> = () => {
  const [data, setData] = useState<Item[]>([]);
  const allData = localStorageLib.local_all_array();
  
  useEffect(() => {
    const initializedArray:Item[] = [];
    allData.map((value) => {
      initializedArray.push({
        time: value.time,
        quantity: value.data.toString(),
        synced: value.synced,
      })
    })
    setData(initializedArray);
  },[])
  

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
              <TableCell>{item.synced ? "〇" : "×"}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => { handleDelete(index, item.time) }}>
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