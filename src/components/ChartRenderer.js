import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ChartRenderer = ({ groupedData, selectedGroups }) => {
  const generateChartData = (data, questionKey, groupName = null) => {
    if (!data || !data.current || !data.previous) {
      return { labels: [], datasets: [] };
    }

    let labels, allProportions;

    if (groupName) {
      // Generate data for group charts
      labels = ['Overall', 'Current', ...data.previous.map((_, index) => `S -${index + 1}`)];
      const currentGroup = data.current.groups[groupName] || { [questionKey]: [0, 0, 0, 0], totalResponses: 0 };
      const previousGroups = data.previous.map(survey => survey.groups[groupName] || { [questionKey]: [0, 0, 0, 0], totalResponses: 0 });

      const overallProportions = (data.current.totalAnswers[questionKey] || []).map(count => data.current.totalResponses > 0 ? count / data.current.totalResponses : 0);
      const currentProportions = (currentGroup[questionKey] || []).map(count => currentGroup.totalResponses > 0 ? count / currentGroup.totalResponses : 0);
      const previousProportions = previousGroups.map(group => (group[questionKey] || []).map(count => group.totalResponses > 0 ? count / group.totalResponses : 0));

      allProportions = [overallProportions, currentProportions, ...previousProportions];
    } else {
      // Generate data for overall charts
      labels = ['Current', ...data.previous.map((_, index) => `S -${index + 1}`)];

      const currentProportions = (data.current.totalAnswers[questionKey] || []).map(count => data.current.totalResponses > 0 ? count / data.current.totalResponses : 0);
      const previousProportions = data.previous.map(survey => (survey.totalAnswers[questionKey] || []).map(count => survey.totalResponses > 0 ? count / survey.totalResponses : 0));

      allProportions = [currentProportions, ...previousProportions];
    }

    return {
      labels: labels,
      datasets: [
        { label: 'Answer 1', data: allProportions.map(p => p[0]), backgroundColor: 'rgba(255, 99, 132, 0.5)' },
        { label: 'Answer 2', data: allProportions.map(p => p[1]), backgroundColor: 'rgba(54, 162, 235, 0.5)' },
        { label: 'Answer 3', data: allProportions.map(p => p[2]), backgroundColor: 'rgba(255, 206, 86, 0.5)' },
        { label: 'Answer 4', data: allProportions.map(p => p[3]), backgroundColor: 'rgba(75, 192, 192, 0.5)' },
      ]
    };
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataset = context.dataset;
            const value = dataset.data[context.dataIndex];
            return `${dataset.label}: ${(value * 100).toFixed(2)}%`;
          }
        }
      },
      datalabels: {
        display: true,
        color: 'black',
        formatter: (value) => `${(value * 100).toFixed(2)}%`,
      }
    },
    scales: {
      x: {
        stacked: true,
        min: 0,
        max: 1,
        ticks: {
          callback: function(value) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: true,
        }
      }
    },
    indexAxis: 'y',
  };

  if (!groupedData || !selectedGroups || !selectedGroups.length || !groupedData[selectedGroups[0]]) {
    return null; // Handle case where data is not yet loaded or properly initialized
  }

  const allQuestions = Object.keys(groupedData[selectedGroups[0]].current.totalAnswers || {}).filter(key => !selectedGroups.includes(key));

  return (
    <div>
      {selectedGroups.map(groupKey => (
        <div key={groupKey}>
          <h3>Grouping: {groupKey}</h3>
          <div>
            {allQuestions.map(questionKey => (
              <div key={questionKey} className="chart-container">
                <h4>{questionKey}</h4>
                <Bar data={generateChartData(groupedData[groupKey], questionKey)} options={chartOptions} />
              </div>
            ))}
            {Object.keys(groupedData[groupKey].current.groups || {}).map(group => (
              <div key={group}>
                <h4>Group: {group}</h4>
                {allQuestions.map(questionKey => (
                  <div key={questionKey} className="chart-container">
                    <h5>Question: {questionKey}</h5>
                    <Bar data={generateChartData(groupedData[groupKey], questionKey, group)} options={chartOptions} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartRenderer;
