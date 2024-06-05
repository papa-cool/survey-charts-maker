import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import GroupSelector from './components/GroupSelector';
import PreviousSurveyUploader from './components/PreviousSurveyUploader';
import ChartRenderer from './components/ChartRenderer';
import GenerateAndDownload from './components/GenerateAndDownload';
import DataProcessor from './components/DataProcessor';

function App() {
  const [step, setStep] = useState(1);
  const [rawData, setRawData] = useState({});
  const [processedData, setProcessedData] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesParsed = (parsedFile, filePath) => {
    setRawData(prevState => ({
      ...prevState,
      [parsedFile.surveyType]: parsedFile.data
    }));
    if (parsedFile.surveyType === 'current') {
      setHeaders(Object.keys(parsedFile.data[0]));
      setStep(2); // Move to step 2 after current survey is uploaded
    } else {
      setUploadedFiles(prevState => [...prevState, filePath]);
      setStep(3); // Stay in step 3 for next file upload
    }
  };

  const handleGroupSelection = (groups) => {
    setSelectedGroups(groups);
  };

  const handleProcessedData = (data) => {
    setProcessedData(data);
    setIsProcessing(false);
  };

  const proceedToStep4 = () => {
    setIsProcessing(true);
    setStep(4);
  };

  return (
    <div className="App font-sans text-center">
      {step === 1 && (
        <div className="step1">
          <h2 className="my-5">Welcome to the Data Visualization App</h2>
          <p className="my-2">This app helps you analyze survey results by generating detailed charts based on selected grouping columns.</p>
          <div class="drop-zone border-2 border-dashed border-gray-400 rounded w-1/2 h-48 flex items-center justify-center m-auto">
            <FileUploader onFilesParsed={handleFilesParsed} />
          </div>
          <p className="mt-2 text-xs text-gray-600">Drop here your survey results to start. CSV, XLS, and XLSX files are accepted.</p>
        </div>
      )}

      {step === 2 && (
        <div className="step2">
          <h2 className="my-5">Select Grouping Columns</h2>
          <p className="my-2">Select the columns that are used for categorization (grouping).</p>
          <GroupSelector
            headers={headers}
            selectedGroups={selectedGroups}
            onSelectGroup={handleGroupSelection}
          />
          <button className="text-lg px-5 py-2 mt-5" onClick={() => setStep(3)}>Validate Selection</button>
        </div>
      )}

      {step === 3 && (
        <div className="step3">
          <h2 className="my-5">Upload Previous Surveys</h2>
          {uploadedFiles.length > 0 && <p className="my-2 text-green-500 mt-2">Uploaded files: {uploadedFiles.join(', ')}</p>}
          <p className="my-2">Upload the previous surveys to analyze evolution.</p>
          <PreviousSurveyUploader onFilesParsed={handleFilesParsed} uploadedFilesNumber={uploadedFiles.length} />
          <button onClick={proceedToStep4}>Next</button>
        </div>
      )}

      {step === 4 && (
        <div className="step4">
          <GenerateAndDownload groupedData={processedData} selectedGroups={selectedGroups} />
          {isProcessing && (
            <DataProcessor rawData={rawData} selectedGroups={selectedGroups} onProcessedData={handleProcessedData} />
          )}
          {processedData && (
            <div className="flex justify-around flex-wrap mt-5">
              {selectedGroups.map(categorizationType => (
                <div key={categorizationType} className="flex-1 m-2">
                  <h3>{categorizationType}</h3>
                  <ChartRenderer groupedData={processedData[categorizationType]} categorizationType={categorizationType} />
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
