import React, { useEffect } from 'react';

const DataProcessor = ({ rawData, onProcessedData }) => {
  useEffect(() => {
    if (rawData.current && rawData.previous1 && rawData.previous2) {
      const processSurveyData = (surveyData) => {
        const survey = {
          groups: {},
          totalAnswers: { question1: [0, 0, 0, 0], question2: [0, 0, 0, 0] },
          totalResponses: 0
        };

        surveyData.forEach(row => {
          const group = row['Group'];
          const q1 = parseInt(row['Question 1'], 10);
          const q2 = parseInt(row['Question 2'], 10);

          if (!survey.groups[group]) {
            survey.groups[group] = { question1: [0, 0, 0, 0], question2: [0, 0, 0, 0], totalResponses: 0 };
          }

          survey.groups[group].question1[q1 - 1]++;
          survey.totalAnswers.question1[q1 - 1]++;
          survey.groups[group].question2[q2 - 1]++;
          survey.totalAnswers.question2[q2 - 1]++;
          survey.groups[group].totalResponses++;
          survey.totalResponses++;
        });

        return survey;
      };

      const currentSurvey = processSurveyData(rawData.current);
      const previous1Survey = processSurveyData(rawData.previous1);
      const previous2Survey = processSurveyData(rawData.previous2);

      onProcessedData({
        current: currentSurvey,
        previous: [previous1Survey, previous2Survey]
      });
    }
  }, [rawData, onProcessedData]);

  return null;
};

export default DataProcessor;
