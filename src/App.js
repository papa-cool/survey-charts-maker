import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import DataProcessor from './components/DataProcessor';
import ChartRenderer from './components/ChartRenderer';
import GroupSelector from './components/GroupSelector';
import GenerateAndDownload from './components/GenerateAndDownload';
import './App.css';

function App() {
  const [rawData, setRawData] = useState({});
  const [processedData, setProcessedData] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesParsed = (parsedFile) => {
    setRawData(prevState => ({
      ...prevState,
      [parsedFile.surveyType]: parsedFile.data
    }));
    if (parsedFile.surveyType === 'current') {
      setHeaders(Object.keys(parsedFile.data[0]));
    }
  };

  const handleGroupSelection = (groups) => {
    setSelectedGroups(groups);
  };

  const handleProcessedData = (data) => {
    setProcessedData(data);
    setIsProcessing(false);
  };

  const generateCharts = () => {
    setIsProcessing(true);
    setProcessedData(null); // Clear previous processed data
  };

  return (
    <div className="App">
      <h1>Data Visualization App</h1>
      <FileUploader onFilesParsed={handleFilesParsed} />
      <GroupSelector
        headers={headers}
        selectedGroups={selectedGroups}
        onSelectGroup={handleGroupSelection}
      />
      <button onClick={generateCharts}>Generate Charts</button>
      {isProcessing && (
        <DataProcessor rawData={rawData} selectedGroups={selectedGroups} onProcessedData={handleProcessedData} />
      )}
      {processedData && (
        <>
          <ChartRenderer groupedData={processedData} selectedGroups={selectedGroups} />
          <GenerateAndDownload groupedData={processedData} selectedGroups={selectedGroups} />
        </>
      )}
    </div>
  );
}

export default App;
