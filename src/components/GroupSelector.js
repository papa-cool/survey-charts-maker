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
    <div className="group-selector">
      {headers.map((header, index) => (
        <button
          key={index}
          className={`group-selector-button ${selectedGroups.includes(header) ? 'selected' : ''}`}
          onClick={() => handleGroupSelection(header)}
        >
          {header}
        </button>
      ))}
    </div>
  );
};

export default GroupSelector;
