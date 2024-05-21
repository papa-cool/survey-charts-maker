import React from 'react';

const GroupSelector = ({ headers, selectedGroups, onSelectGroup }) => {
  const handleGroupSelection = (header) => {
    if (selectedGroups.includes(header)) {
      onSelectGroup(selectedGroups.filter(group => group !== header));
    } else {
      onSelectGroup([...selectedGroups, header]);
    }
  };

  return (
    <div>
      <h3>Select Grouping Columns</h3>
      <div>
        {headers.map((header, index) => (
          <button
            key={index}
            style={{ backgroundColor: selectedGroups.includes(header) ? 'lightblue' : 'white' }}
            onClick={() => handleGroupSelection(header)}
          >
            {header}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupSelector;
