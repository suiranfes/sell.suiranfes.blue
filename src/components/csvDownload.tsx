import React, { useState } from 'react';
import { productData } from './data';

// Material UI / Icons
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

interface DataObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
interface SellItem {
  item: string;
  quantity: number;
}

// オブジェクトの配列をCSV形式の文字列に変換する関数
function convertArrayOfObjectsToCSV(data: DataObject[]): string {
  const csv = data.map(row => {
    return Object.entries(row).map(([, value]) => {
      // 値が文字列でない場合はtoString()メソッドを使用して文字列に変換
      const escapedValue = typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value.toString();
      return escapedValue;
    })
      .join(',');
  }).join('\n');
  return 'data:text/csv;charset=utf-8,' + encodeURIComponent('\uFEFF' + csv);
}

// CSVファイルをダウンロードする関数
function downloadCSV(csvData: string, fileName: string) {
  const link = document.createElement('a');
  link.setAttribute('href', csvData);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}

function _getTime() {
  const d = new Date();
  const year = d.getFullYear().toString().padStart(4, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return (year + month + day + "-" + hour + minute + seconds);
}

// CSVダウンロードボタンのReactコンポーネント(総数)
export const CSVDownloadButton1: React.FC<{ data: SellItem[] }> = ({ data }) => {
  const [fileName, setFileName] = useState('quantity_sold.csv');

  const handleDownload = () => {
    // if (window.navigator.onLine) {
    //   //preserveData(data, "post", where);
    //   //createTodo("post",newData);
    // }
    const csvData = convertArrayOfObjectsToCSV(data);
    downloadCSV(csvData, _getTime() + "_" + fileName);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  return (
    <div>
      <input type="text" value={fileName} onChange={handleFileNameChange} style={{ display: "none" }} />
      <Button onClick={handleDownload} endIcon={<DownloadIcon />}>合計個数データ</Button>
    </div>
  );
};

interface Item {
  time: string;
  quantity: string;
}

const CSVTableComponent2: React.FC<{ data: Item[] }> = ({ data }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [fileName, setFileName] = useState('analysis_data.csv');

  // preserveData(data,"detailData",);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const to_entire_data: any[][] = [];

  const to_top_data: string[] = [""];
  // console.log(data);
  for (let i = 0; i < productData.length; i++) {
    to_top_data.push(productData[i].product);
  }
  to_entire_data.push(to_top_data);
  //const top_data = to_top_data;
  for (let i = 0; i < data.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const to_row_data: any[] = [data[i].time];
    const tidyData: string[] = data[i].quantity.replace(/[[\]""]/g, '').split(",");
    for (let j = 0; j < productData.length; j++) {
      for (let k = 0; k < tidyData.length - 1; k++) {
        if (productData[j].product === tidyData[k]) { to_row_data.push(Number(tidyData[k + 1])); }
      }
      // if (data[i].quantity.replace(/[[\]""]/g, '').indexOf(productData[j].product) === -1) { to_row_data.push(0); }
    }
    to_entire_data.push(to_row_data);
  }
  // console.log(to_entire_data);

  // const [tableData] = useState(sampleData);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleDownload = () => {
    // generateCSV(to_entire_data, fileName);
    const csvData = convertArrayOfObjectsToCSV(to_entire_data);
    downloadCSV(csvData, _getTime() + "_" + fileName);
  };

  return (
    <div>
      <input type="text" value={fileName} onChange={handleFileNameChange} style={{ display: "none" }} />
      <Button onClick={handleDownload} endIcon={<DownloadIcon />}>会計別個数データ</Button>
    </div>
  );
};

export default CSVTableComponent2;
