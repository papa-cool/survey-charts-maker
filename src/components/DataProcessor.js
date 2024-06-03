import { useEffect } from 'react';

const DataProcessor = ({ rawData, selectedGroups, onProcessedData }) => {
  useEffect(() => {
    if (!rawData || !rawData.current || !selectedGroups || selectedGroups.length === 0) {
      return;
    }

    const processSurveyData = (surveyData, groupByColumn) => {
      const survey = {
        groups: {},
        questions: {},
        totalResponses: 0
      };

      surveyData.forEach(row => {
        const groupKey = row[groupByColumn];

        // Set default value for the group.
        if (!survey.groups[groupKey]) {
          survey.groups[groupKey] = { questions: {}, totalResponses: 0 };
          Object.keys(row).forEach(question => {
            if (selectedGroups.includes(question)) return // Exclude grouping columns from questions
            survey.groups[groupKey].questions[question] = [0, 0, 0, 0];
            survey.questions[question] = survey.questions[question] || [0, 0, 0, 0];
          });
        }

        let rowAnswered = false;

        Object.keys(row).forEach(question => {
          if (selectedGroups.includes(question)) return // Exclude grouping columns from questions
          
          const answer = parseInt(row[question], 10);
          if (answer >= 1 && answer <= 4) {
            survey.groups[groupKey].questions[question][answer - 1]++;
            survey.questions[question][answer - 1]++;
            if (!rowAnswered) {
              survey.groups[groupKey].totalResponses++;
              survey.totalResponses++;
              rowAnswered = true;
            }
          }
        });
      });

      return survey;
    };

    const processedData = {};
    selectedGroups.forEach(groupByColumn => {
      processedData[groupByColumn] = {}
      Object.keys(rawData).forEach(key => {
        processedData[groupByColumn][key] = processSurveyData(rawData[key], groupByColumn)
      })
    });

    onProcessedData(processedData);
  }, [rawData, selectedGroups, onProcessedData]);

  return null;
};

export default DataProcessor;
