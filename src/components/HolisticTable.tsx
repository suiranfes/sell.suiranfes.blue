import { useState } from "react";
import { DataTable } from "./DataTable";
import { TotalTable } from "./totalTable";
import { Recovery } from "./RecoveryNetwork";

export const HolisticTable: React.FC<{}> = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const refreshTables = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div>
      <Recovery onRecovery={refreshTables} />
      <h3>あなたのデータ</h3>
      <br />
      <TotalTable updateTrigger={updateTrigger} />
      <br />
      <DataTable onDelete={refreshTables} updateTrigger={updateTrigger} />
    </div>
  )
}