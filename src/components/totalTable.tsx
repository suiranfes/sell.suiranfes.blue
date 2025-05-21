import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { LocalStorageLib } from "./localStorageLib";
import { useEffect, useState } from "react";
const localStorageLib = new LocalStorageLib();

type Props = {
  updateTrigger: number;
};

export const TotalTable: React.FC<Props> = ({ updateTrigger }) => {
  const [items, setItems] = useState<string[][]>([]);

  useEffect(() => {
    setItems(localStorageLib.local_total_array());
  }, [updateTrigger]);
  // const items = localStorageLib.local_total_array();
  return (
    <TableContainer component={Paper}>
      <Table size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            {items.map(([name], index) => (
              <TableCell key={index} align="center">
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {items.map(([_, count], index) => (
              <TableCell key={index} align="center">
                {count}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
