import React from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const FileUploader = ({ onFileParsed }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        if (file.type === 'text/csv') {
          Papa.parse(data, {
            header: true,
            complete: (results) => {
              onFileParsed(results.data);
            },
            error: (error) => {
              console.error("Error parsing CSV file:", error);
            }
          });
        } else {
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const headers = parsedData[0];
          const rows = parsedData.slice(1).map(row => {
            const obj = {};
            row.forEach((cell, i) => {
              obj[headers[i]] = cell;
            });
            return obj;
          });
          onFileParsed(rows);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <input
      type="file"
      accept=".csv,.xls,.xlsx"
      onChange={handleFileUpload}
    />
  );
};

export default FileUploader;
