import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { LocalStorageLib } from "./localStorageLib";
import { writeToSheet } from "./SheetOperater";

const localStorageLib = new LocalStorageLib();

type Props = {
  onRecovery: () => void;
};

const SHARING_KEY = "sharing_in_progress";
// synced == false のデータを送信する。
export const Recovery: React.FC<Props> = ({ onRecovery }) => {
  const [isWorking, setIsWorking] = useState<boolean>(false);
  useEffect(() => {
    const sharingStatus = sessionStorage.getItem(SHARING_KEY);
    if (sharingStatus === "true") {
      setIsWorking(true);
    }
  }, []);

  const sendRest = async () => {
    setIsWorking(true);
    sessionStorage.setItem(SHARING_KEY, "true");
    try {
      const allData = localStorageLib.local_all_array();
      let countSynced = 0;
      let unsyncedCount = 0;
      const promises = allData.map(async (parchase) => {
        const isSynced = parchase.synced;
        if (!isSynced) {
          unsyncedCount++;
          const formatedData: Record<string, string> = {}
          parchase.data.map((value) => {
            const product = value[0];
            const quantity = value[1];
            formatedData[product] = quantity;
          })

          const success = await writeToSheet(formatedData, parchase.time);
          if (success) {
            const saveData = {
              data: parchase.data,
              synced: true
            }
            localStorage.setItem(parchase.time, JSON.stringify(saveData));
            countSynced++;
          }
        }
      });
      await Promise.all(promises);
      if (unsyncedCount == 0) { alert("共有されていないデータはありませんでした。"); }
      else if (countSynced == 0) { alert("共有すべきデータはありましたが、すべての送信に失敗しました。"); }
      else { alert(`共有されていなかった${countSynced}コのデータが共有されました。`); }
    } catch {
      alert("共有中にエラーが発生しました。");
    } finally {
      sessionStorage.removeItem(SHARING_KEY);
      setIsWorking(false);
      onRecovery();
    }
  }

  return (
    <div>
      <Button onClick={sendRest} endIcon={<UploadIcon />}>共有できていないデータを再送信</Button>
      {isWorking ? "working" : ""}
    </div>
  )
}
