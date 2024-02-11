import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Papa from "papaparse";
import TableView from "./TableView";
import TextInfo from "./TextInfo";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

export default function DashboardPage() {
  const [query, setQuery] = React.useState("");
  const [resultData, setResultData] = React.useState([]);
  const [timeTaken, setTimeTaken] = React.useState(0); //in seconds
  const [fileSize, setFileSize] = React.useState(0); //in KB
  const [status, setStatus] = React.useState("Ready");
  const [rowCount, setRowCount] = React.useState(0);
  const [columnCount, setColumnCount] = React.useState(0);
  const [recentList, setRecentList] = React.useState([]);
  const [favQueryList, setFavQueryList] = React.useState([]);
  const [view, setView] = React.useState("Recent");

  const addRecentQuery = (newItem) => {
    setRecentList((prevArray) => [...prevArray, newItem]);
  };

  const addFavQuery = (newItem) => {
    setFavQueryList((prevArray) => [...prevArray, newItem]);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  const handleFetch = async () => {
    let url;
    addRecentQuery([query, Date.now()]);
    var input = query.toLowerCase();
    if (input.includes("customers")) {
      input = "customers";
    } else if (input.includes("nifty")) {
      input = "nifty";
    }

    switch (input.toLowerCase()) {
      case "customers":
        url =
          "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/customers.csv";
        break;
      case "nifty":
        url =
          "https://raw.githubusercontent.com/the-loudspeaker/todoey/main/test/big_data.csv";
        break;
      default:
        url =
          "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/products.csv";
        break;
    }

    const startTime = performance.now(); //more precise than date.now()
    try {
      setStatus("Loading");
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const csvData = await response.text();

      if (
        !query.startsWith("update") &&
        !query.startsWith("delete") &&
        !query.startsWith("drop") &&
        !query.startsWith("insert")
      ) {
        // Parse CSV data using papaparse
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            const endTime = performance.now();
            const timeTakenInSeconds = (endTime - startTime) / 1000; // Convert to seconds
            setTimeTaken(timeTakenInSeconds);
            setFileSize(
              (response.headers.get("Content-Length") / 1024).toFixed(2)
            );
            setResultData(result.data);
            setRowCount(result.data.length);
            setColumnCount(Object.keys(result.data[0]).length);
            setStatus("Success");
          },
          error: (error) => {
            console.error("Error parsing CSV:", error.message);
            setResultData([]);
            setTimeTaken(0);
            setFileSize(0);
            setRowCount(0);
            setColumnCount(0);
            setStatus("Failure");
          },
        });
      } else {
        setResultData([]);
        setRowCount(Math.floor(Math.random() * 500 + 1));
        setColumnCount(0);
        setStatus("Success");
      }
    } catch (error) {
      console.error("Error fetching CSV:", error.message);
      setResultData([]);
      setTimeTaken(0);
      setFileSize(0);
      setStatus("Failure");
    }
  };

  function handleDownload(csvData, format) {
    const fileName = "Query-" + Date.now(); //include current epoch time in file name.
    const extension = format === "Table" ? ".csv" : ".json";

    //for table
    const header = Object.keys(csvData[0]);
    const rows = csvData.map((row) => Object.values(row));
    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    //for json
    const jsonObject = csvData.map((row) => {
      const jsonRow = {};
      Object.keys(row).forEach((key) => {
        // parse numbers
        jsonRow[key] = isNaN(row[key]) ? row[key] : parseFloat(row[key]);
      });
      return jsonRow;
    });
    const jsonContent = JSON.stringify(jsonObject, null, 2);

    const encodedUri =
      format === "Table"
        ? encodeURI("data:text/csv;charset=utf-8," + csvContent)
        : encodeURI("data:application/json;charset=utf-8," + jsonContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName + extension);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const last10Items = recentList.slice(-10).reverse();
  const last10FavItems = favQueryList.slice(-10).reverse();
  const activeItems = view === "Recent" ? last10Items : last10FavItems;
  function formatDate(timestamp) {
    const formattedDate = new Date(timestamp);
    return (
      formattedDate.toLocaleTimeString("en-IN") +
      " " +
      formattedDate.toDateString()
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextareaAutosize
            style={{ width: "100%", resize: "vertical" }}
            minRows={16}
            placeholder="Query"
            maxRows={32}
            value={query}
            onChange={handleInputChange}
          />
          <ButtonGroup
            color="primary"
            aria-label="Actions"
            sx={{ width: "100%" }}
          >
            <Button
              variant="contained"
              disabled={query.length <= 7}
              onClick={handleFetch}
              sx={{ flexGrow: 1 }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              disabled={!(status === "Loading")}
              sx={{ flexGrow: 1 }}
            >
              Stop
            </Button>
            <Button
              variant="text"
              disabled={query.length <= 7}
              sx={{ flexGrow: 1 }}
              onClick={() => {
                addFavQuery([query, Date.now()]);
              }}
            >
              Add favourite
            </Button>
          </ButtonGroup>
          <TextInfo
            timeTaken={timeTaken}
            numRows={rowCount}
            fileSize={fileSize}
            status={status}
            numColumns={columnCount}
          />
          <ButtonGroup color="primary" sx={{ width: "100%" }}>
            <Button
              variant="text"
              startIcon={<DownloadIcon />}
              sx={{ flexGrow: 1 }}
              disabled={resultData.length === 0}
              onClick={() =>
                resultData.length !== 0
                  ? handleDownload(resultData, "Table")
                  : null
              }
            >
              Download as CSV
            </Button>
            <Button
              variant="text"
              startIcon={<DownloadIcon />}
              sx={{ flexGrow: 1 }}
              disabled={resultData.length === 0}
              onClick={() =>
                resultData.length !== 0
                  ? handleDownload(resultData, "Json")
                  : null
              }
            >
              Download as Json
            </Button>
          </ButtonGroup>
          <TableView csvData={resultData} />
        </Box>
      </div>
      <div style={{ width: "30%" }}>
        <ToggleButtonGroup
          color="primary"
          aria-label="views"
          exclusive
          sx={{ width: "100%" }}
          value={view}
          onChange={handleViewChange}
        >
          <ToggleButton
            value="Recent"
            aria-label="Recent Queries"
            sx={{ flexGrow: 1 }}
          >
            Recent Queries
          </ToggleButton>
          <ToggleButton
            value="Favourite"
            aria-label="Favourite Queries"
            sx={{ flexGrow: 1 }}
          >
            Favourite Queries
          </ToggleButton>
        </ToggleButtonGroup>
        <List>
          {activeItems.length > 0 ? (
            activeItems.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  setQuery(item[0]);
                }}
              >
                <ListItemText
                  primary={item[0]}
                  secondary={formatDate(item[1])}
                />
              </ListItemButton>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No recent queries" />
            </ListItem>
          )}
        </List>
      </div>
    </div>
  );
}
