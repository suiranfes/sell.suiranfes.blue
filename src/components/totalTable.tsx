import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { LocalStorageLib } from "./localStorageLib";
const localStorageLib = new LocalStorageLib();

export const TotalTable: React.FC<{}> = () => {
  const items = localStorageLib.local_total_array();
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