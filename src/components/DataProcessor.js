import React, { useEffect } from 'react';

const DataProcessor = ({ rawData, onProcessedData }) => {
  useEffect(() => {
    if (rawData.length > 0) {
      const processCSVData = (data) => {
        const groups = {};
        const totalAnswers = { question1: [0, 0, 0, 0], question2: [0, 0, 0, 0] };
        let totalResponses = 0;

        data.forEach(row => {
          const group = row['Group'];
          const q1 = parseInt(row['Question 1'], 10);
          const q2 = parseInt(row['Question 2'], 10);

          if (!groups[group]) {
            groups[group] = { question1: [0, 0, 0, 0], question2: [0, 0, 0, 0], totalResponses: 0 };
          }

          groups[group].question1[q1 - 1]++;
          totalAnswers.question1[q1 - 1]++;

          groups[group].question2[q2 - 1]++;
          totalAnswers.question2[q2 - 1]++;

          groups[group].totalResponses++;
          totalResponses++;
        });

        onProcessedData({ groups, totalAnswers, totalResponses });
      };

      processCSVData(rawData);
    }
  }, [rawData, onProcessedData]);

  return null;
};

export default DataProcessor;
