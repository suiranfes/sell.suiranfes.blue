import { Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';

import { LocalStorageLib } from "./localStorageLib";
import { writeToSheet } from "./SheetOperater";
import { useState } from "react";
const localStorageLib = new LocalStorageLib();

//synced == false のデータを送信する。
export const Recovery: React.FC<{}> = () => {
  const [isWorking,setIsWorking] = useState(false);
  const sendRest = async () => {
    setIsWorking(true);
    try{
      const allData = localStorageLib.local_all_array();
      let countSynced = 0;
      let unsyncedCount = 0;
      const promises = allData.map(async (parchase) => {
        const isSynced = parchase.synced;
        if(!isSynced){
          unsyncedCount++;
          const formatedData:Record<string, string> = {}
          parchase.data.map((value) => {
            const product = value[0];
            const quantity = value[1];
            formatedData[product] = quantity;
          })

          const success = await writeToSheet(formatedData,parchase.time);
          if(success){
            const saveData = {
              data: parchase.data,
              synced: true
            }
            localStorage.setItem(parchase.time,JSON.stringify(saveData));
            countSynced++;
          }
        }
      });
      await Promise.all(promises);
      if(unsyncedCount == 0){alert("共有されていないデータはありませんでした。");}
      else if(countSynced == 0){alert("共有すべきデータはありましたが、すべての送信に失敗しました。");}
      else{alert(`共有されていなかった${countSynced}コのデータが共有されました。`);}  
      setIsWorking(false)
    }catch{
      alert("共有中にエラーが発生しました。");
      setIsWorking(false);
    }
  }

  return(
  <div>
    <Button onClick={sendRest} endIcon={<UploadIcon/>}>共有できていないデータを再送信</Button>
    {isWorking ? "working" : ""}
  </div>
  )
}
