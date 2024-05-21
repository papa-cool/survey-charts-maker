import React, { useEffect } from 'react';

const DataProcessor = ({ rawData, selectedGroups, onProcessedData }) => {
  useEffect(() => {
    if (rawData.current) {
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

      const currentSurvey = processSurveyData(rawData.current, selectedGroups);
      const previousSurveys = ['previous1', 'previous2', 'previous3']
        .filter(key => rawData[key])
        .map(key => processSurveyData(rawData[key], selectedGroups));

      onProcessedData({
        current: currentSurvey,
        previous: previousSurveys
      });
    }
  }, [rawData, selectedGroups, onProcessedData]);

  return null;
};

export default DataProcessor;
