import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

import { LocalStorageLib } from "./localStorageLib";
const localStorageLib = new LocalStorageLib();
import { deleteRowFromSheet } from "./SheetOperater";
import { useEffect, useState } from "react";

interface Item {
  time: string;
  quantity: string;
  synced: boolean;
}

type Props = {
  onDelete: () => void;
  updateTrigger: number;

};
export const DataTable: React.FC<Props> = ({onDelete,updateTrigger}) => {
  const [data, setData] = useState<Item[]>([]);
  // const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [deletingIndexes, setDeletingIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const allData = localStorageLib.local_all_array();
    const initializedArray:Item[] = [];
    allData.map((value) => {
      initializedArray.push({
        time: value.time,
        quantity: value.data.toString(),
        synced: value.synced,
      })
    })
    initializedArray.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setData(initializedArray);
  },[updateTrigger])
  

  const handleDelete = async (index: number, time: string) => {
    const confirmed = window.confirm(`データ「${time}」を削除しますか？`);
    if (!confirmed) return;
    if (localStorage.getItem("isUser") == "false" || localStorage.getItem("isUser") == null) {
      alert("ユーザーページからログインしてください");
      return;
    }

    setDeletingIndexes(prev => new Set(prev).add(index));
    
    try{
      // setDeletingIndex(index);
      const isDelete = await deleteRowFromSheet(time);
      if(isDelete){
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);

        const getKey = Object.keys(localStorage);
        for (let i = 0; i < getKey.length; i++) {
          if (getKey[i].indexOf(time) >= 0) {
            localStorage.removeItem(getKey[i]);
          }
        }
      }
      else{
        alert("データの削除に失敗しました。インターネットを確認してください。");
      }
    } catch(error) {
      console.error("データの削除に失敗しました:", error);
    } finally {
      // setDeletingIndex(null);
      setDeletingIndexes(prev => {
        const updated = new Set(prev);
        updated.delete(index);
        return updated;
      });
      onDelete();
    }
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
                {deletingIndexes.has(index) ? (
                  <CircularProgress size="20px"/>
                ) : (
                <IconButton
                  color="primary"
                  onClick={() => { handleDelete(index, item.time) }}>
                  <DeleteIcon />
                </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};