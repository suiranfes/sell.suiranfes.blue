import { productData } from "./data";

type ReturnArray = {
  time: string;
  data: string[][];
  synced: boolean;
};

export class LocalStorageLib {

  local_key_array = (): string[] => {
    const keySplitArray: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const pushkey = Object.keys(localStorage)[i];
      if (pushkey[0] != "userEmail" && pushkey[0] != "isUser") {
        keySplitArray.push(pushkey);
      }
      //console.log(pushkey);
    }
    //時間で降順に並べ替え
    keySplitArray.sort(function (a, b) { return (Number(a[0]) - Number(b[0])); });
    return keySplitArray;
  }


  local_all_array = (): ReturnArray[] => {
    const returnArray: ReturnArray[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== "userEmail" && key !== "isUser") {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsedData = JSON.parse(value);
            returnArray.push({
              time: key,
              data: parsedData.data,
              synced: parsedData.synced
            });
          } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
          }
        }
      }
    }
    return returnArray;
  }  
    
  local_total_array = ():(string)[][] => {
    const returnArray:(string)[][] =[]
    productData.map((value) => {
      returnArray.push([value.product,"0"])
    })
    const allData = this.local_all_array();
    allData.map((purchase) => {
      purchase.data.map((value) => {
        returnArray.map((mainValue) => {
          if(value[0] == mainValue[0]){
            const sum = Number(value[1]) + Number(mainValue[1]);
            mainValue[1] = sum.toString();
          }
        })
      })
    })
    return returnArray;
  }
    
  // local_array = (): (string | number)[][] => {
  //   type LocalStorageData = Record<string, Array<[string, number]>>;
  //   const looseJsonParse = (obj: string) => {
  //     return Function('"use strict";return (' + obj + ')')();
  //   };
  //   // localStorageからデータを取得
  //   const localStorageData: Record<string, Array<[string, number]>> = {};
  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (key && key !== "userEmail" && key !== "isUser") {
  //       const value = localStorage.getItem(key);
  //       if (value) {
  //         try {
  //           const dataValue = JSON.parse(value).data;
  //           // JSON-like構造をパース
  //           const parsedValue = looseJsonParse(`[${dataValue}]`) as Array<[string, number]>;
  //           localStorageData[key] = parsedValue;
  //         } catch (e) {
  //           console.error(`Error parsing localStorage key "${key}":`, e);
  //         }
  //       }
  //     }
  //   }

  //   // データを整形
  //   const formatData = (localData: LocalStorageData): Array<(string | number)[]> => {
  //     return Object.entries(localData).map(([key, purchases]) => {

  //       // 商品の個数を初期化
  //       const quantities = Array(productData.length).fill(0);

  //       // 購入情報から個数を更新
  //       //console.log(purchases);
  //       purchases.forEach(([productName, quantity]) => {
  //         const productIndex = productData.findIndex((p) => p.product === productName);
  //         if (productIndex !== -1) {
  //           quantities[productIndex] = quantity;
  //         }
  //       });

  //       return [key, ...quantities];
  //     });
  //   };

  //   //console.log(localStorageData);
  //   const formattedData = formatData(localStorageData);

  //   formattedData.unshift();
  //   return formattedData;
  // }
}
