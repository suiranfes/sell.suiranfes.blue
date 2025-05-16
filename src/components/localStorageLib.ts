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

  local_total_array = (): (string)[][] => {
    const returnArray: (string)[][] = []
    productData.map((value) => {
      returnArray.push([value.product, "0"])
    })
    const allData = this.local_all_array();
    allData.map((purchase) => {
      purchase.data.map((value) => {
        returnArray.map((mainValue) => {
          if (value[0] == mainValue[0]) {
            const sum = Number(value[1]) + Number(mainValue[1]);
            mainValue[1] = sum.toString();
          }
        })
      })
    })
    return returnArray;
  }
}
