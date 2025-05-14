import { useState } from "react";
import { DataTable } from "./DataTable";
import { TotalTable } from "./totalTable";

export const HolisticTable: React.FC<{}> = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const refreshTables = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return(
  <div>
    <TotalTable updateTrigger={updateTrigger}/>
    <p></p>
    <DataTable onDelete={refreshTables}/>
  </div>
  )
}