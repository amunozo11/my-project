import React from "react";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 border-b-2 border-gray-700 pb-2">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onTabChange(index)}
          className={`px-4 py-2 font-semibold ${
            activeTab === index
              ? "text-green-500 border-b-2 border-green-500"
              : "text-gray-400 hover:text-green-400"
          } transition-all duration-300`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
