import { useState } from "react";
import { DataTable } from "./DataTable";
import { TotalTable } from "./totalTable";
import { Recovery } from "./RecoveryNetwork";
import { CSVDownloadButtonTotal, CSVTableComponentEach } from './csvDownload';

export const HolisticTable: React.FC<{}> = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const refreshTables = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div id="data">
      <h2>データ</h2>
      <Recovery onRecovery={refreshTables} />
      <h3>あなたのデータ</h3>
      <CSVDownloadButtonTotal />
      <br />
      <TotalTable updateTrigger={updateTrigger} />
      <br />
      <CSVTableComponentEach />
      <DataTable onDelete={refreshTables} updateTrigger={updateTrigger} />
    </div>
  )
}