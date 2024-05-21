import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const FileUploader = ({ onFilesParsed }) => {
  const [fileData, setFileData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [firstTwoRows, setFirstTwoRows] = useState([]);

  const handleFileUpload = (event, surveyType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        if (file.type === 'text/csv') {
          Papa.parse(data, {
            header: true,
            complete: (result) => {
              const rows = result.data;
              setHeaders(Object.keys(rows[0]));
              setFirstTwoRows(rows.slice(0, 2));
              onFilesParsed({ data: rows, surveyType });
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
          setHeaders(headers);
          setFirstTwoRows(rows.slice(0, 2));
          onFilesParsed({ data: rows, surveyType });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <h3>Upload Current Survey</h3>
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={(e) => handleFileUpload(e, 'current')}
      />
      <h3>Upload S -1 Survey</h3>
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={(e) => handleFileUpload(e, 'previous1')}
      />
      <h3>Upload S -2 Survey</h3>
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={(e) => handleFileUpload(e, 'previous2')}
      />
      <h3>Upload S -3 Survey</h3>
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={(e) => handleFileUpload(e, 'previous3')}
      />
      {fileData && (
        <div>
          <h4>File Preview</h4>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {firstTwoRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
