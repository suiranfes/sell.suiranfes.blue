import React, { useState } from 'react';
import { productData } from './data';
import { LocalStorageLib } from './localStorageLib';
const localStorageLib = new LocalStorageLib();

// Material UI / Icons
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

interface DataObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// オブジェクトの配列をCSV形式の文字列に変換する関数
function convertObjArrayToCSV(data: DataObject[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),  
    // 各データ行
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (value == null) return '';
        const strValue = value.toString();
        const escaped = strValue.includes('"') || strValue.includes(',') || strValue.includes('\n')
          ? `"${strValue.replace(/"/g, '""')}"`
          : strValue;
        return escaped;
      }).join(',')
    )
  ];

  // UTF-8 BOM付きCSV文字列をデータURIとして返す
  return 'data:text/csv;charset=utf-8,' + encodeURIComponent('\uFEFF' + csvRows.join('\n'));
}

// CSVファイルをダウンロードする関数
function downloadCSV(csvData: string, fileName: string) {
  const link = document.createElement('a');
  link.setAttribute('href', csvData);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}

// 現在の時刻を取得する関数
function getCurrentTime() {
  const d = new Date();
  return (
    d.getFullYear().toString().padStart(4, '0') +     
    (d.getMonth() + 1).toString().padStart(2, '0') +  
    d.getDate().toString().padStart(2, '0') +        
    "-" +
    d.getHours().toString().padStart(2, '0') +    
    d.getMinutes().toString().padStart(2, '0') +    
    d.getSeconds().toString().padStart(2, '0')        
  );
}

// CSVダウンロードボタンのReactコンポーネント(総数)
export const CSVDownloadButtonTotal: React.FC<{}> = () => {
  const fileName = 'quantity_sold.csv';
  const handleDownload = () => {
    const total_array = localStorageLib.local_total_array();
    const total_obj: DataObject[]  = [];
    total_array.map((value ,index) => {
      total_obj[index] = {"product" : value[0],"quantity" :value[1]};
    })
    const csvData = convertObjArrayToCSV(total_obj);
    console.log(csvData);
    downloadCSV(csvData, getCurrentTime() + "_" + fileName);
  };

  return (
    <div>
      <Button onClick={handleDownload} endIcon={<DownloadIcon />}>合計個数データ</Button>
    </div>
  );
};

export const CSVTableComponentEach: React.FC<{}> = () => {
  const fileName = 'analysis_data.csv';

  const handleDownload = () => {
    const all_array = localStorageLib.local_all_array();
    const productArray = productData.map((value) => {return value.product}); //品物だけを取り出して配列に
    const all_obj:DataObject[] = all_array.map((purchase) => {
      const productObj:DataObject = {}; //{品物名:個数}の形
      productArray.map((product) => {
        const purchaseProduct = purchase.data.map((value) => {return value[0]}); //購入履歴でも品物だけを取り出して配列に
        const indexProduct = purchaseProduct.indexOf(product); 
        if(indexProduct != -1){
          productObj[product] = Number(purchase.data[indexProduct][1]); 
        } else {
          productObj[product] = 0;
        }
      })
      return {"time":purchase.time , ...productObj};
    })
    const csvData = convertObjArrayToCSV(all_obj);
    downloadCSV(csvData, getCurrentTime() + "_" + fileName);
  };

  return (
    <div>
      <Button onClick={handleDownload} endIcon={<DownloadIcon />}>会計別個数データ</Button>
    </div>
  );
};
