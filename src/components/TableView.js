import { Paper, TableContainer } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const TableView = ({ csvData, status }) => {
  if (!csvData || csvData.length === 0) {
    return <div>No data to display</div>;
  }

  // Convert first row to columns
  const headers = Object.keys(csvData[0]);
  const columns = headers.map((header) => ({ field: header, flex: 1 }));

  const jsonObject = csvData.map((row, index) => {
    const jsonRow = {};
    jsonRow["uniqueId"] = index;
    Object.keys(row).forEach((key) => {
      // parse numbers
      jsonRow[key] = isNaN(row[key]) ? row[key] : parseFloat(row[key]);
    });
    return jsonRow;
  });

  return (
    <TableContainer component={Paper} style={{ maxHeight: "70vh" }}>
      <DataGrid
        columns={columns}
        rows={jsonObject}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 30]}
        getRowId={(row) => row.uniqueId}
        checkboxSelection={false}
        sx={{
          "& .MuiDataGrid-root": {
            background: "#282C34",
            color: "#ffff",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "#fff",
          },
          "& .MuiSvgIcon-fontSizeSmall": {
            color: "#fff",
          },
          ".MuiDataGrid-cellContent": {
            whiteSpace: "break-spaces",
            wordBreak: "break-word",
          },
          ".MuiDataGrid-row": {
            display: "flex",
            flexDirection: "row",
          },
          "& .MuiDataGrid-columnHeaders": {
            background: "#282C34",
            color: "#fff",
          },
        }}
      />
      {/* <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                style={{ color: "white", backgroundColor: "#282C34" }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {csvData.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={header}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </TableContainer>
  );
};

export default TableView;
