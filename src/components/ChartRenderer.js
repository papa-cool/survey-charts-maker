import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ChartRenderer = ({ groupedData }) => {
  const generateChartData = (data, questionKey) => {
    const labels = Object.keys(data.groups);
    const groupedQuestionData = labels.map(label => data.groups[label][questionKey]);
    const totalQuestionData = data.totalAnswers[questionKey];

    const proportions = groupedQuestionData.map((group, index) => {
      const total = data.groups[labels[index]].totalResponses;
      return group.map((count) => total > 0 ? count / total : 0);
    });

    const totalProportions = totalQuestionData.map(count => data.totalResponses > 0 ? count / data.totalResponses : 0);

    return {
      labels: [...labels, 'Total'],
      datasets: [
        { label: 'Answer 1', data: [...proportions.map(p => p[0]), totalProportions[0]], count: [...groupedQuestionData.map(g => g[0]), totalQuestionData[0]], backgroundColor: 'rgba(255, 99, 132, 0.5)' },
        { label: 'Answer 2', data: [...proportions.map(p => p[1]), totalProportions[1]], count: [...groupedQuestionData.map(g => g[1]), totalQuestionData[1]], backgroundColor: 'rgba(54, 162, 235, 0.5)' },
        { label: 'Answer 3', data: [...proportions.map(p => p[2]), totalProportions[2]], count: [...groupedQuestionData.map(g => g[2]), totalQuestionData[2]], backgroundColor: 'rgba(255, 206, 86, 0.5)' },
        { label: 'Answer 4', data: [...proportions.map(p => p[3]), totalProportions[3]], count: [...groupedQuestionData.map(g => g[3]), totalQuestionData[3]], backgroundColor: 'rgba(75, 192, 192, 0.5)' },
      ]
    };
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataset = context.dataset;
            const value = dataset.count[context.dataIndex];
            return `${dataset.label}: ${value}`;
          }
        }
      },
      datalabels: {
        display: true,
        color: 'black',
        formatter: (value, context) => context.dataset.count[context.dataIndex],
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

  const question1ChartData = groupedData ? generateChartData(groupedData, 'question1') : null;
  const question2ChartData = groupedData ? generateChartData(groupedData, 'question2') : null;

  return (
    <div>
      {question1ChartData && (
        <div className="chart-container">
          <h3>Question 1</h3>
          <Bar data={question1ChartData} options={chartOptions} />
        </div>
      )}
      {question2ChartData && (
        <div className="chart-container">
          <h3>Question 2</h3>
          <Bar data={question2ChartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ChartRenderer;
