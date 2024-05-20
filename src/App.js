import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import DataProcessor from './components/DataProcessor';
import ChartRenderer from './components/ChartRenderer';
import './App.css';

function App() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState(null);

  return (
    <div className="App">
      <h1>Data Visualization App</h1>
      <FileUploader onFileParsed={setRawData} />
      <DataProcessor rawData={rawData} onProcessedData={setProcessedData} />
      {processedData && <ChartRenderer groupedData={processedData} />}
    </div>
  );
}

export default App;
