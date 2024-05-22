import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const AbstractChartRenderer = ({ labels, datasets }) => {
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

  return (
    <Bar data={{ labels, datasets }} options={chartOptions} />
  );
};

const generateChartData = (data, questionKey, includeGroups = false) => {
  if (!data || !data.current || !data.previous) {
    return { labels: [], datasets: [] };
  }

  const previousLabels = data.previous.map((_, index) => index === 0 ? 'Previous' : `Survey -${index + 1}`);
  let labels = ['Current', ...previousLabels];
  let allProportions = [
    (data.current.totalAnswers[questionKey] || []).map(count => data.current.totalResponses > 0 ? count / data.current.totalResponses : 0),
    ...data.previous.map(survey => (survey.totalAnswers[questionKey] || []).map(count => survey.totalResponses > 0 ? count / survey.totalResponses : 0))
  ];

  if (includeGroups) {
    const groupLabels = Object.keys(data.current.groups || {});
    labels = [...labels, ...groupLabels];
    const groupProportions = groupLabels.map(groupName => {
      const group = data.current.groups[groupName] || { [questionKey]: [0, 0, 0, 0], totalResponses: 0 };
      return (group[questionKey] || []).map(count => group.totalResponses > 0 ? count / group.totalResponses : 0);
    });
    allProportions = [...allProportions, ...groupProportions];
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

const OverallChart = ({ groupedData, selectedGroups }) => {
  if (!groupedData || !selectedGroups.length) return null;

  const allQuestions = Object.keys(groupedData[selectedGroups[0]].current.totalAnswers || {}).filter(key => !selectedGroups.includes(key));
  
  return (
    <div id={`group-${selectedGroups[0]}-overall`}>
      {allQuestions.map(questionKey => (
        <div key={questionKey} className="chart-container">
          <h4>{questionKey}</h4>
          <AbstractChartRenderer {...generateChartData(groupedData[selectedGroups[0]], questionKey, true)} />
        </div>
      ))}
    </div>
  );
};

const GroupChart = ({ groupedData, selectedGroups }) => {
  if (!groupedData || !selectedGroups.length) return null;

  const allQuestions = Object.keys(groupedData[selectedGroups[0]].current.totalAnswers || {}).filter(key => !selectedGroups.includes(key));

  return (
    <div>
      {Object.keys(groupedData[selectedGroups[0]].current.groups || {}).map(group => (
        <div key={group} id={`group-${selectedGroups[0]}-${group}`}>
          <h4>Group: {group}</h4>
          {allQuestions.map(questionKey => (
            <div key={questionKey} className="chart-container">
              <h5>Question: {questionKey}</h5>
              <AbstractChartRenderer {...generateChartData(groupedData[selectedGroups[0]], questionKey, false)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ChartRenderer = ({ groupedData, selectedGroups }) => {
  if (!groupedData || !selectedGroups || !selectedGroups.length || !groupedData[selectedGroups[0]]) {
    return null; // Handle case where data is not yet loaded or properly initialized
  }

  return (
    <div>
      <h3>Overall Charts</h3>
      <OverallChart groupedData={groupedData} selectedGroups={selectedGroups} />
      <h3>Group Charts</h3>
      <GroupChart groupedData={groupedData} selectedGroups={selectedGroups} />
    </div>
  );
};

export default ChartRenderer;
