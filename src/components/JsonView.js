import { Paper } from "@mui/material";
import React from "react";

const JsonView = ({ csvData }) => {
  if (!csvData || csvData.length === 0) {
    return <div>No data to display</div>;
  }

  const jsonObject = csvData.map((row) => {
    const jsonRow = {};
    Object.keys(row).forEach((key) => {
      // parse numbers
      jsonRow[key] = isNaN(row[key]) ? row[key] : parseFloat(row[key]);
    });
    return jsonRow;
  });

  return (
    <Paper
      style={{
        maxHeight: "70vh",
        width: "100%",
      }}
    >
      <pre>{JSON.stringify(jsonObject, null, 2)}</pre>
    </Paper>
  );
};

export default JsonView;
