import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const completedTasks = 3;
  const pendingTasks = 5;
  const overdueTasks = 1;
  const chartData = {
    labels: ["Completed Tasks", "Pending Tasks", "Overdue Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [completedTasks, pendingTasks, overdueTasks],
        backgroundColor: ["#2563eb", "#1d4ed8", "#1e3a8a"],
        hoverBackgroundColor: ["#3b82f6", "#2563eb", "#1d4ed8"],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-950 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-lg shadow-lg"
      >
        Report
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="bg-gray-100 rounded-lg w-[600px] max-h-[85vh] overflow-y-auto shadow-lg z-50 relative">
            <div className="sticky top-0 bg-blue-950 z-10 border-b px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Project Report</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-300 rounded-full p-2 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            {/* Modal Body: Flex Layout */}
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-50 p-4 rounded-md shadow-md">
                <div className="w-full h-[250px]">
                  <Pie data={chartData} />
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Project Overview</h3>
                  <p className="text-gray-600">Name: Test 1</p>
                  <p className="text-gray-600">Priority: Low</p>
                  <p className="text-gray-600">Status: Active</p>
                </div>
                {/* Tasks */}
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Tasks</h3>
                  <p className="text-gray-600">Total Tasks: {completedTasks + pendingTasks + overdueTasks}</p>
                  <p className="text-gray-600">Completed Tasks: {completedTasks}</p>
                  <p className="text-gray-600">Pending Tasks: {pendingTasks}</p>
                  <p className="text-gray-600">Past Due: {overdueTasks}</p>
                </div>
                {/* Team */}
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Team</h3>
                  <p className="text-gray-600">Total Members: 10</p>
                </div>
                {/* Files */}
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Files</h3>
                  <p className="text-gray-600">Total Files: 7</p>
                </div>
              </div>
            </div>
          </div>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default ReportModal;