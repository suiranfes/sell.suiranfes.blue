import React, { useEffect, useState } from 'react';
import { productData } from './data'; // データ

// firebase
import db from "./firebase";
import { collection, getDocs } from 'firebase/firestore';

const DataFromFirebase: React.FC = () => {
  // _Item の定義
  interface _Item {
    product: string;
    quantity: number;
  }

  // _productData に quantity:0 を代入する
  let _productData: _Item[] = productData.map((data) => {
    return {
      product: data.product,
      quantity: 0
    }
  });
  //console.log(_productData); // log
  const [, setMaxTimeData] = useState<any[]>([]);
  const [newProductData, setNewProductData] = useState<_Item[]>([]);

  const fetchData = async () => {
    // _productData[0].quantity=0;
    // console.log(_productData[0].quantity);
    try {

      // Firestoreから全データを取得
      const querySnapshot = await getDocs(collection(db, "post"));
      const fetchedData = querySnapshot.docs.map(doc => doc.data());
      // 各whereの値ごとに最大のtimeを持つデータを取得
      const maxTimeDataArray: any[] = [];
      const whereValues: Set<string> = new Set();
      //console.log(querySnapshot)
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const whereValue = data.where;
        const time = data.time;

        if (!whereValues.has(whereValue)) {
          // whereの値が初めて出現した場合、そのデータを追加
          maxTimeDataArray.push({ where: whereValue, time: time });
          whereValues.add(whereValue);
        } else {
          // whereの値がすでに出現している場合、timeを比較して最大のものを更新
          const existingIndex = maxTimeDataArray.findIndex(item => item.where === whereValue);
          if (time > maxTimeDataArray[existingIndex].time) {
            maxTimeDataArray[existingIndex].time = time;
          }
        }
      });
      //console.log(maxTimeDataArray);
      setMaxTimeData(maxTimeDataArray);
      _productData = productData.map((data) => {
        const one_of_productData = {
          product: data.product,
          quantity: 0
        }
        return one_of_productData;
      });
      //console.log(_productData);

      for (let i = 0; i < fetchedData.length; i++) {
        for (let j = 0; j < maxTimeDataArray.length; j++) {
          if (fetchedData[i].where === maxTimeDataArray[j].where && fetchedData[i].time === maxTimeDataArray[j].time) {
            for (let k = 0; k < _productData.length; k++) {
              _productData[k].quantity += fetchedData[i][_productData[k].product];
            }

          }
        }
      }
      console.log(_productData);
      setNewProductData(_productData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (window.navigator.onLine) {
      fetchData();
    } else {
      console.log("インターネットが接続されていません。)");
    }
    // 下は ESLint で出るエラーの対策用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const NoneInternet: React.FC = () => {
    if (!window.navigator.onLine) {
      return (<h3>インターネットが接続されていません。)</h3>)
    } else {
      return (<div></div>)
    }
  }
  //買われた総数を表示する表のコンポーネント
  const ItemTable: React.FC<{ items: _Item[] }> = ({ items }) => {
    return (
      <table>
        <thead>
          <tr>
            {items.map((_item, index) => (
              <th key={index}>{_item.product}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {items.map((_item, index) => (
              <td key={index}>{_item.quantity}</td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <div>
      <ItemTable items={newProductData} />
      <NoneInternet />
    </div>
  );
};

export default DataFromFirebase;
