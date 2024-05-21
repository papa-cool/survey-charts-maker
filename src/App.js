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

  const handleFilesParsed = (parsedFile) => {
    setRawData(prevState => ({
      ...prevState,
      [parsedFile.surveyType]: parsedFile.data
    }));
    if (parsedFile.surveyType === 'current') {
      setHeaders(Object.keys(parsedFile.data[0]));
    }
  };

  const processSurveyData = (surveyData, selectedGroups) => {
    const survey = {
      groups: {},
      totalAnswers: {},
      totalResponses: 0
    };

    surveyData.forEach(row => {
      const groupKey = selectedGroups.map(group => row[group]).join('_');
      if (!survey.groups[groupKey]) {
        survey.groups[groupKey] = { totalResponses: 0 };
        Object.keys(row).forEach(question => {
          if (!selectedGroups.includes(question)) {
            survey.groups[groupKey][question] = [0, 0, 0, 0];
            survey.totalAnswers[question] = survey.totalAnswers[question] || [0, 0, 0, 0];
          }
        });
      }

      Object.keys(row).forEach(question => {
        if (!selectedGroups.includes(question)) {
          const answer = parseInt(row[question], 10);
          if (answer >= 1 && answer <= 4) {
            survey.groups[groupKey][question][answer - 1]++;
            survey.totalAnswers[question][answer - 1]++;
            survey.groups[groupKey].totalResponses++;
            survey.totalResponses++;
          }
        }
      });
    });

    return survey;
  };

  const handleGroupSelection = (groups) => {
    setSelectedGroups(groups);
  };

  const generateCharts = () => {
    if (rawData.current) {
      const currentSurvey = processSurveyData(rawData.current, selectedGroups);
      const previousSurveys = ['previous1', 'previous2', 'previous3']
        .filter(key => rawData[key])
        .map(key => processSurveyData(rawData[key], selectedGroups));

      setProcessedData({
        current: currentSurvey,
        previous: previousSurveys
      });
    }
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
