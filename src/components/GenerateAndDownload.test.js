import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GenerateAndDownload from './GenerateAndDownload';
import { act } from 'react';
import { saveAs } from 'file-saver';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('GenerateAndDownload', () => {
  const groupedData = {
    Team: {
      current: {
        groups: {
          Tech: { Q1: [1, 0, 0, 0], Q2: [0, 1, 0, 0], totalResponses: 1 },
          Marketing: { Q1: [0, 0, 1, 0], Q2: [0, 0, 0, 1], totalResponses: 1 },
        },
        totalAnswers: { Q1: [1, 0, 1, 0], Q2: [0, 1, 0, 1] },
        totalResponses: 2,
      },
      previous: [],
    },
  };

  const selectedGroups = ['Team'];

  test('renders download button', () => {
    const { getByText } = render(<GenerateAndDownload groupedData={groupedData} selectedGroups={selectedGroups} />);
    expect(getByText(/Download Charts/i)).toBeInTheDocument();
  });

  test('triggers download when button is clicked', async () => {
    const { getByText } = render(<GenerateAndDownload groupedData={groupedData} selectedGroups={selectedGroups} />);
    const button = getByText(/Download Charts/i);

    await act(async () => {
      fireEvent.click(button);
    });

    // Check if the download function was called
    expect(saveAs).toHaveBeenCalled();
  });
});
