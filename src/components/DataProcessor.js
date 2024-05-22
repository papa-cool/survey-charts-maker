import React, { useEffect } from 'react';

const DataProcessor = ({ rawData, selectedGroups, onProcessedData }) => {
  useEffect(() => {
    if (!rawData || !rawData.current || !selectedGroups || selectedGroups.length === 0) {
      return;
    }

    const processSurveyData = (surveyData, groupByColumn) => {
      const survey = {
        groups: {},
        totalAnswers: {},
        totalResponses: 0
      };

      surveyData.forEach(row => {
        const groupKey = row[groupByColumn];
        if (!survey.groups[groupKey]) {
          survey.groups[groupKey] = { totalResponses: 0 };
          Object.keys(row).forEach(question => {
            if (question !== groupByColumn) {
              survey.groups[groupKey][question] = [0, 0, 0, 0];
              survey.totalAnswers[question] = survey.totalAnswers[question] || [0, 0, 0, 0];
            }
          });
        }

        let rowAnswered = false;

        Object.keys(row).forEach(question => {
          if (question !== groupByColumn) {
            const answer = parseInt(row[question], 10);
            if (answer >= 1 && answer <= 4) {
              survey.groups[groupKey][question][answer - 1]++;
              survey.totalAnswers[question][answer - 1]++;
              if (!rowAnswered) {
                survey.groups[groupKey].totalResponses++;
                survey.totalResponses++;
                rowAnswered = true;
              }
            }
          }
        });
      });

      return survey;
    };

    const processedData = {};
    selectedGroups.forEach(groupByColumn => {
      processedData[groupByColumn] = {
        current: processSurveyData(rawData.current, groupByColumn),
        previous: ['previous1', 'previous2', 'previous3']
          .filter(key => rawData[key])
          .map(key => processSurveyData(rawData[key], groupByColumn))
      };
    });

    onProcessedData(processedData);
  }, [rawData, selectedGroups, onProcessedData]);

  return null;
};

export default DataProcessor;
