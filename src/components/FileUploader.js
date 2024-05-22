import React from 'react';
import Dropzone from 'react-dropzone';
import * as XLSX from 'xlsx';

const FileUploader = ({ onFilesParsed }) => {
  const handleDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        onFilesParsed({ surveyType: 'current', data: worksheet }, file.path);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drop your current survey file here, or click to select file.</p>
        </div>
      )}
    </Dropzone>
  );
};

export default FileUploader;
