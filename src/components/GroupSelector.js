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
    <div className="flex flex-wrap justify-center mt-5">
      {headers.map((header, index) => (
        <button
          key={index}
          className={`m-1 px-4 py-2 border-none rounded cursor-pointer ${selectedGroups.includes(header) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleGroupSelection(header)}
        >
          {header}
        </button>
      ))}
    </div>
  );
};

export default GroupSelector;
