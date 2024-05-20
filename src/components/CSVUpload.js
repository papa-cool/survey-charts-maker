import React, { useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const CSVUpload = () => {
  const [csvData, setCsvData] = useState([]);
  const [groupedData, setGroupedData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          processCSVData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        }
      });
    }
  };

  const processCSVData = (data) => {
    const groups = {};
    const totalAnswers = { question1: [0, 0, 0, 0], question2: [0, 0, 0, 0] };
    let totalResponses = 0;

    data.forEach(row => {
      const group = row['Group'];
      const q1 = parseInt(row['Question 1']);
      const q2 = parseInt(row['Question 2']);

      if (!groups[group]) {
        groups[group] = { question1: [0, 0, 0, 0], question2: [0, 0, 0, 0], totalResponses: 0 };
      }

      if (q1 >= 1 && q1 <= 4) {
        groups[group].question1[q1 - 1]++;
        totalAnswers.question1[q1 - 1]++;
      }

      if (q2 >= 1 && q2 <= 4) {
        groups[group].question2[q2 - 1]++;
        totalAnswers.question2[q2 - 1]++;
      }

      groups[group].totalResponses++;
      totalResponses++;
    });

    setGroupedData({ groups, totalAnswers, totalResponses });
  };

  const generateChartData = (data, questionKey) => {
    const labels = Object.keys(data.groups);
    const groupedQuestionData = labels.map(label => data.groups[label][questionKey]);
    const totalQuestionData = data.totalAnswers[questionKey];

    const proportions = groupedQuestionData.map(group => group.map((count, i) => count / data.groups[labels[0]].totalResponses));
    const totalProportions = totalQuestionData.map(count => count / data.totalResponses);

    return {
      labels: [...labels, 'Total'],
      datasets: [
        { label: '1', data: [...proportions.map(p => p[0]), totalProportions[0]], backgroundColor: 'rgba(255, 99, 132, 0.5)' },
        { label: '2', data: [...proportions.map(p => p[1]), totalProportions[1]], backgroundColor: 'rgba(54, 162, 235, 0.5)' },
        { label: '3', data: [...proportions.map(p => p[2]), totalProportions[2]], backgroundColor: 'rgba(255, 206, 86, 0.5)' },
        { label: '4', data: [...proportions.map(p => p[3]), totalProportions[3]], backgroundColor: 'rgba(75, 192, 192, 0.5)' },
      ]
    };
  };

  const chartOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    }
  };

  const question1ChartData = groupedData ? generateChartData(groupedData, 'question1') : null;
  const question2ChartData = groupedData ? generateChartData(groupedData, 'question2') : null;

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />
      {question1ChartData && (
        <div>
          <h3>Question 1</h3>
          <Bar data={question1ChartData} options={chartOptions} />
        </div>
      )}
      {question2ChartData && (
        <div>
          <h3>Question 2</h3>
          <Bar data={question2ChartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
