import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const AbstractChartRenderer = ({ labels, data }) => {
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

  let datasets = [
    { label: '1', data: data.map(p => p[0]), backgroundColor: 'rgba(255, 0, 0, 0.5)' },
    { label: '2', data: data.map(p => p[1]), backgroundColor: 'rgba(255, 165, 0, 0.5)' },
    { label: '3', data: data.map(p => p[2]), backgroundColor: 'rgba(255, 255, 0, 0.5)' },
    { label: '4', data: data.map(p => p[3]), backgroundColor: 'rgba(0, 192, 0, 0.5)' },
  ]

  return (
    <Bar data={{ labels, datasets }} options={chartOptions} />
  );
};

const transformCountsToPercents = (survey, questionKey) => {
  return survey.questions[questionKey].map(count => survey.totalResponses > 0 ? count / survey.totalResponses : 0)
}

const OverallChart = ({ data, questionKey }) => {
  let labels = ['Current'];
  let allProportions = Array(data.length)
  allProportions[0] = transformCountsToPercents(data.current, questionKey)

  let previousIndex = 0
  while(data[`previous${previousIndex}`]) {
    labels = [...labels, previousIndex === 0 ? 'Previous' : `Survey -${previousIndex + 1}`]
    allProportions[previousIndex + 1] = transformCountsToPercents(data[`previous${previousIndex}`], questionKey)
    previousIndex++
  }

  const groupLabels = Object.keys(data.current.groups || {});
  labels = [...labels, ...groupLabels];
  const groupProportions = groupLabels.map(groupName => transformCountsToPercents(data.current.groups[groupName], questionKey));
  allProportions = [...allProportions, ...groupProportions];
  
  return (
    <div key={questionKey} className="chart-container">
      <h4>{questionKey}</h4>
      <AbstractChartRenderer labels={labels} data={allProportions} />
    </div>
  );
};


const GroupChart = ({ data, groupName, questionKey }) => {
  let labels = ['Overall', groupName];
  let allProportions = [
    transformCountsToPercents(data.current, questionKey),
    transformCountsToPercents(data.current.groups[groupName], questionKey)
  ]

  let previousIndex = 0
  while(data[`previous${previousIndex}`]) {
    labels = [...labels, previousIndex === 0 ? 'Previous' : `Survey -${previousIndex + 1}`]
    allProportions = [...allProportions, transformCountsToPercents(data[`previous${previousIndex}`].groups[groupName], questionKey)]
    previousIndex++
  }

  return (
    <div key={questionKey} className="chart-container">
      <h4>{questionKey}</h4>
      <AbstractChartRenderer labels={labels} data={allProportions} />
    </div>
  )
};

const ChartRenderer = ({ groupedData, categorizationType }) => {
  if (!groupedData) {
    return null; // Handle case where data is not yet loaded or properly initialized
  }

  const allQuestions = Object.keys(groupedData.current.questions)

  return (
    <div>
      <div key={`group-${categorizationType}-overall`} id={`group-${categorizationType}-overall`}>
        <h3>Overall Charts</h3>
        {allQuestions.map(questionKey => (
          <OverallChart data={groupedData} questionKey={questionKey} />
        ))}
      </div>
      {Object.keys(groupedData.current.groups || {}).map(group => (
        <div key={`group-${categorizationType}-${group}`} id={`group-${categorizationType}-${group}`}>
          <h3>{group}</h3>
          {allQuestions.map(questionKey => (
            <GroupChart data={groupedData} groupName={group} questionKey={questionKey} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChartRenderer;
