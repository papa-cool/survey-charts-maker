import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GroupSelector from './GroupSelector';
import { act } from 'react';

describe('GroupSelector', () => {
  test('renders group selector buttons with provided headers', () => {
    const headers = ['Team', 'Country', 'Seniority'];
    const { getByText } = render(<GroupSelector headers={headers} selectedGroups={[]} onSelectGroup={() => {}} />);

    headers.forEach(header => {
      expect(getByText(header)).toBeInTheDocument();
    });
  });

  test('calls onSelectGroup with correct group selection', () => {
    const headers = ['Team', 'Country', 'Seniority'];
    const onSelectGroupMock = jest.fn();
    const { getByText } = render(<GroupSelector headers={headers} selectedGroups={[]} onSelectGroup={onSelectGroupMock} />);

    const button = getByText('Team');
    act(() => {
      fireEvent.click(button);
    });

    expect(onSelectGroupMock).toHaveBeenCalledWith(['Team']);
  });

  test('toggles group selection correctly', () => {
    const headers = ['Team', 'Country', 'Seniority'];
    const onSelectGroupMock = jest.fn();
    const { getByText } = render(<GroupSelector headers={headers} selectedGroups={['Team']} onSelectGroup={onSelectGroupMock} />);

    const button = getByText('Team');
    act(() => {
      fireEvent.click(button);
    });

    expect(onSelectGroupMock).toHaveBeenCalledWith([]);
  });
});
