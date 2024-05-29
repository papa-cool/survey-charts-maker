import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DataProcessor from './DataProcessor';
import { act } from 'react';

describe('DataProcessor', () => {
  test('processes survey data correctly', async () => {
    const rawData = {
      current: [
        { Team: 'Tech', Q1: '1', Q2: '2' },
        { Team: 'Marketing', Q1: '3', Q2: '4' },
      ],
      previous1: [
        { Team: 'Tech', Q1: '2', Q2: '3' },
        { Team: 'Marketing', Q1: '4', Q2: '1' },
      ],
    };

    const selectedGroups = ['Team'];
    const onProcessedDataMock = jest.fn();

    render(<DataProcessor rawData={rawData} selectedGroups={selectedGroups} onProcessedData={onProcessedDataMock} />);

    await waitFor(() => {
      expect(onProcessedDataMock).toHaveBeenCalledWith(expect.any(Object));
    });

    const processedData = onProcessedDataMock.mock.calls[0][0];
    expect(processedData).toHaveProperty('Team.current');
    expect(processedData.Team.current.groups).toHaveProperty('Tech');
    expect(processedData.Team.current.groups).toHaveProperty('Marketing');
  });
});
