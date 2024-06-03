import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ChartRenderer from './ChartRenderer';
import { act } from 'react';

describe('ChartRenderer', () => {
  const groupedData = {
    Team: {
      current: {
        groups: {
          Tech: { questions: { Q1: [1, 0, 0, 0], Q2: [0, 1, 0, 0] }, totalResponses: 1 },
          Marketing: { questions: { Q1: [0, 0, 1, 0], Q2: [0, 0, 0, 1] }, totalResponses: 1 },
        },
        questions: { Q1: [1, 0, 1, 0], Q2: [0, 1, 0, 1] },
        totalResponses: 2,
      }
    }
  };

  const selectedGroups = ['Team'];

  test('renders charts correctly', async () => {
    const { getByText, getAllByText } = render(<ChartRenderer groupedData={groupedData['Team']} categorizationType={'Team'} />);

    await waitFor(() => {
      expect(getByText(/Overall Charts/i)).toBeInTheDocument();
      expect(getByText(/Tech/i)).toBeInTheDocument();
      expect(getByText(/Marketing/i)).toBeInTheDocument();
      expect(getAllByText(/Q1/i)[0]).toBeInTheDocument();
      expect(getAllByText(/Q2/i)[0]).toBeInTheDocument();
    });
  });
});
