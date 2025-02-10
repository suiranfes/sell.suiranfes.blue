import { productData } from "./data";

export class LocalStorageLib {

  local_key_array = (): string[][] => {
    const keySplitArray: string[][] = []
    for (let i = 0; i < localStorage.length; i++) {
      const pushkey = Object.keys(localStorage)[i].split(')');
      if (pushkey[0] != "ID" && pushkey[0] != "isUser") {
        keySplitArray.push(pushkey);
      }
      //console.log(pushkey);
    }
    //時間で降順に並べ替え
    keySplitArray.sort(function (a, b) { return (Number(a[0]) - Number(b[0])); });
    return keySplitArray;
  }

  local_all_array = (): (string | number)[][] => {
    type LocalStorageData = Record<string, Array<[string, number]>>;
    const looseJsonParse = (obj: string) => {
      return Function('"use strict";return (' + obj + ')')();
    };
    // localStorageからデータを取得
    const localStorageData: Record<string, Array<[string, number]>> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== "ID" && key !== "isUser") {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            // JSON-like構造をパース
            const parsedValue = looseJsonParse(`[${value}]`) as Array<[string, number]>;
            localStorageData[key] = parsedValue;
          } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
          }
        }
      }
    }

    // データを整形
    const formatData = (localData: LocalStorageData): Array<(string | number)[]> => {
      return Object.entries(localData).map(([key, purchases]) => {
        // キーを分割して UTC 部分とローカル時間部分を抽出
        const [utcPart, localTimePart] = key.split(")");

        // 商品の個数を初期化
        const quantities = Array(productData.length).fill(0);

        // 購入情報から個数を更新
        //console.log(purchases);
        purchases.forEach(([productName, quantity]) => {
          const productIndex = productData.findIndex((p) => p.product === productName);
          if (productIndex !== -1) {
            quantities[productIndex] = quantity;
          }
        });

        return [utcPart, localTimePart, ...quantities];
      });
    };

    //console.log(localStorageData);
    const formattedData = formatData(localStorageData);

    formattedData.unshift();
    return formattedData;
  }
}
