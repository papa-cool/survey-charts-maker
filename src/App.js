import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import GroupSelector from './components/GroupSelector';
import PreviousSurveyUploader from './components/PreviousSurveyUploader';
import ChartRenderer from './components/ChartRenderer';
import GenerateAndDownload from './components/GenerateAndDownload';
import DataProcessor from './components/DataProcessor'; // Import DataProcessor
import './App.css';

function App() {
  const [step, setStep] = useState(1);
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
      setStep(2); // Move to step 2 after current survey is uploaded
    } else {
      setStep(3); // Move to next file upload step after previous survey is uploaded
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
      {step === 1 && (
        <div className="step1">
          <h2>Welcome to the Data Visualization App</h2>
          <p>This app helps you analyze survey results by generating detailed charts based on selected grouping columns.</p>
          <div className="drop-zone">
            <FileUploader onFilesParsed={handleFilesParsed} />
          </div>
          <p className="file-acceptance">Drop here your survey results to start. CSV, XLS, and XLSX files are accepted.</p>
        </div>
      )}

      {step === 2 && (
        <div className="step2">
          <h2>Select Grouping Columns</h2>
          <p>Select the columns that are used for categorization (grouping).</p>
          <GroupSelector
            headers={headers}
            selectedGroups={selectedGroups}
            onSelectGroup={handleGroupSelection}
          />
          <button onClick={() => setStep(3)}>Validate Selection</button>
        </div>
      )}

      {step === 3 && (
        <div className="step3">
          <h2>Upload Previous Survey</h2>
          <p>Upload the previous survey to analyze evolution.</p>
          <PreviousSurveyUploader onFilesParsed={handleFilesParsed} />
          <button onClick={() => setStep(4)}>Skip</button>
        </div>
      )}

      {step === 4 && (
        <div className="step4">
          <button onClick={generateCharts}>Download Charts</button>
          {isProcessing && (
            <DataProcessor rawData={rawData} selectedGroups={selectedGroups} onProcessedData={handleProcessedData} />
          )}
          {processedData && (
            <div className="chart-columns">
              {selectedGroups.map(groupKey => (
                <div key={groupKey} className="chart-column">
                  <h3>{groupKey}</h3>
                  <ChartRenderer groupedData={processedData} selectedGroups={[groupKey]} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
