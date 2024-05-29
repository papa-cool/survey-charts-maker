import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import FileUploader from './FileUploader';
import { act } from 'react';

describe('FileUploader', () => {
  test('renders dropzone with proper text', () => {
    const { getByText } = render(<FileUploader onFilesParsed={() => {}} />);
    expect(getByText(/Drop your current survey file here, or click to select file./i)).toBeInTheDocument();
  });

  test('calls onFilesParsed with the correct data', async () => {
    const onFilesParsedMock = jest.fn();
    const { getByText } = render(<FileUploader onFilesParsed={onFilesParsedMock} />);

    const dropzone = getByText(/Drop your current survey file here, or click to select file./i);
    
    // Create a mock file
    const file = new File([new ArrayBuffer(1)], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    Object.defineProperty(dropzone, 'files', {
      value: [file],
    });

    await act(async () => {
      fireEvent.drop(dropzone);
    });

    // Mock reading file
    await waitFor(() => {
      expect(onFilesParsedMock).toHaveBeenCalledTimes(1);
    });
  });
});
