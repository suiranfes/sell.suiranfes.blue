import React, { useState } from 'react';
import { productData } from './data';

interface DataObject {
    [key: string]: any;
}
// オブジェクトの配列をCSV形式の文字列に変換する関数
function convertArrayOfObjectsToCSV(data: DataObject[]): string {
    const csv = data.map(row => {
        return Object.entries(row)
            .map(([key, value]) => {
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

function _getTime(){
    let d = new Date();
    let year = d.getFullYear().toString().padStart(4, '0');
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let hour = d.getHours().toString().padStart(2, '0');
    let minute = d.getMinutes().toString().padStart(2, '0');
    let seconds = d.getSeconds().toString().padStart(2, '0');
    return(year + month + day + "-" + hour + minute + seconds);
}

// CSVダウンロードボタンのReactコンポーネント(総数)
export const CSVDownloadButton1: React.FC<{ data: DataObject[] }> = ({ data }) => {
    const [fileName, setFileName] = useState('quantity_sold.csv');

    const handleDownload = () => {
      const csvData = convertArrayOfObjectsToCSV(data);
      downloadCSV(csvData, _getTime() + "_" + fileName);
    };

    const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    };

    return (
        <div>
            <input type="text" value={fileName} onChange={handleFileNameChange} />
      <button onClick={handleDownload}>データをダウンロード</button>
        </div>
    );
};

// CSVダウンロードボタンのReactコンポーネント(時間ごとの)
// CSVを生成する関数
// const generateCSV = (data: any[][], fileName: string) => {
//   // 文字列をUTF-8にエンコードする関数
//   const encodeUTF8 = (str: string) => {
//     return encodeURIComponent(str);
//   };

//   // CSVデータを作成
//   const csvContent = "data:text/csv;charset=utf-8," + data.map(row => row.map(encodeUTF8).join(",")).join("\n");
  
//   // Blobオブジェクトを作成
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
//   // ダウンロード用のURLを作成
//   const downloadLink = document.createElement("a");
//   const url = URL.createObjectURL(blob);
//   downloadLink.href = url;
//   downloadLink.download = fileName;
  
//   // リンクをクリックしてダウンロードを開始し、必要な後処理を行う
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
//   URL.revokeObjectURL(url);
// };
  
// // サンプルデータ
// const sampleData: any[][] = [
//   [0, "Item 1", "Item 2", "Item 3"],
//   ["11:23", 3, 4, 2],
//   ["13:20", 2, 3, 2]
// ];
  
  interface Item {
    time: string;
    quantity: string;
  }

const CSVTableComponent2: React.FC<{data: Item[]}> = ({ data }) => {
    const [fileName, setFileName] = useState('analysis_data.csv');
    let to_entire_data:any[][]=[];

    let to_top_data:string[] =[""];
    for (let i=0 ; i<productData.length;i++){
      to_top_data.push(productData[i].product);
    }
    to_entire_data.push(to_top_data);
    //const top_data = to_top_data;
    for(let i=0;i<data.length;i++){
      let to_row_data:any[] = [data[i].time];
      const tidyData:string[] = data[i].quantity.replace(/[\[\]"]/g, '').split(",");
      for(let j=0;j<productData.length;j++){
        for(let k=0;k<tidyData.length-1;k++){
            if (productData[j].product===tidyData[k]){to_row_data.push(Number(tidyData[k+1]));}
        } 
        if(data[i].quantity.replace(/[\[\]"]/g, '').indexOf(productData[j].product)===-1){to_row_data.push(0);}
      }
      to_entire_data.push(to_row_data);
    }
    console.log(to_entire_data);

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
        <input type="text" value={fileName} onChange={handleFileNameChange} />
      <button onClick={handleDownload}>データをダウンロード</button>
      </div>
    );
  };
  
export default CSVTableComponent2;
