import { useState } from "react";
import { DataTable } from "./DataTable";
import { TotalTable } from "./totalTable";
import { Recovery } from "./RecoveryNetwork";

export const HolisticTable: React.FC<{}> = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const refreshTables = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return(
  <div>
    <Recovery/>
    <h3>あなたのデータ</h3>
    <p></p>
    <TotalTable updateTrigger={updateTrigger}/>
    <p></p>
    <DataTable onDelete={refreshTables}/>
  </div>
  )
}