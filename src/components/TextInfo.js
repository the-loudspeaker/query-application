import React from "react";

const formatTime = (timeInSeconds) => {
  if (timeInSeconds < 1) {
    return `${Math.round(timeInSeconds * 1000)} ms`;
  } else {
    return `${Math.round(timeInSeconds)} s`;
  }
};

const formatSize = (fileSizeInKB) => {
  if (fileSizeInKB < 1024) {
    return `${fileSizeInKB} KB`;
  } else {
    return `${(fileSizeInKB / 1024).toFixed(2)} MB`;
  }
};

const TextInfo = ({ timeTaken, numRows, fileSize, status, numColumns }) => {
  const formattedTime = formatTime(timeTaken);
  const formattedSize = formatSize(fileSize);

  return (
    <div>
      <span>
        Status: {status} | Time: {formattedTime} | Size: {formattedSize}
        {numRows > 0 && " | Rows: " + numRows}
        {numColumns > 0 && " | Columns: " + numColumns}
      </span>
    </div>
  );
};

export default TextInfo;
