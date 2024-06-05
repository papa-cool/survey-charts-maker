import React from 'react';
import Dropzone from 'react-dropzone';
import * as XLSX from 'xlsx';

const PreviousSurveyUploader = ({ onFilesParsed, uploadedFilesNumber }) => {
  const handleDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const surveyType = `previous${index + uploadedFilesNumber}`;
        onFilesParsed({ surveyType, data: worksheet }, file.path);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps({ className: 'border-2 border-dashed border-gray-400 rounded w-1/2 h-48 flex items-center justify-center m-auto' })}>
          <input {...getInputProps()} />
          <p className="my-2">Drop your previous survey files here, or click to select files.</p>
        </div>
      )}
    </Dropzone>
  );
};

export default PreviousSurveyUploader;
