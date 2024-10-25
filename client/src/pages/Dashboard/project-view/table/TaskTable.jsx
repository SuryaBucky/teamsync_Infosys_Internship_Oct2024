import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, MoreVertical } from 'lucide-react';

// Simple Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`}>
      {message}
    </div>
  );
};

const TaskTable = ({refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Add refreshTrigger to useEffect dependencies
  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]); // This will cause a re-fetch whenever refreshTrigger changes


  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const projectId = localStorage.getItem('project_id');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:3001/task/project/${projectId}/view-tasks`,
        {
          headers: {
            'authorization': token,
          }
        }
      );
      
      setTasks(response.data);
      setFilteredTasks(response.data);
      setLoading(false);
      showToast("Tasks loaded successfully", "success");
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 404) {
        showToast("No tasks found for this project", "error");
      } else if (error.response?.status === 500) {
        showToast("Failed to load tasks. Please try again later", "error");
      } else {
        showToast("Failed to fetch tasks", "error");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = tasks.filter((task) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(lowerCaseQuery) ||
        task.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredTasks(filtered);
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "0":
        return "bg-gray-100 text-gray-800";
      case "1":
        return "bg-blue-100 text-blue-800";
      case "2":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get priority badge style
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "0":
        return "bg-blue-100 text-blue-800";
      case "1":
        return "bg-yellow-100 text-yellow-800";
      case "2":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get status text
  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "To Do";
      case "1":
        return "In Progress";
      case "2":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Function to get priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case "0":
        return "Low";
      case "1":
        return "Medium";
      case "2":
        return "High";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const TableHeader = () => (
    <tr className="border-b bg-gray-100">
      <th className="text-left py-4 px-6 font-medium text-xs">Task</th>
      <th className="text-left py-4 px-6 font-medium text-xs">Description</th>
      <th className="text-left py-4 px-6 font-medium text-xs">Status</th>
      <th className="text-left py-4 px-6 font-medium text-xs">Priority</th>
      <th className="text-left py-4 px-6 font-medium text-xs">Assignees</th>
      <th className="text-left py-4 px-6 font-medium text-xs">Created</th>
      <th className="text-left py-4 px-6 font-medium text-xs">Deadline</th>
      <th className="w-10"></th>
    </tr>
  );

  return (
    <div className="py-6 max-w-[1200px] mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSearch} className="flex justify-between items-center mb-8">
        <div className="hidden lg:block font-medium text-lg">Tasks</div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <TableHeader />
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task._id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{task.title}</span>
                      <span className="text-xs text-gray-500">{task.creator_id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="max-w-[200px] truncate text-sm" title={task.description}>
                      {task.description}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex justify-center items-center px-2 py-1 rounded-full text-xs ${getStatusStyle(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex justify-center items-center px-2 py-1 rounded-full text-xs ${getPriorityStyle(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, Math.max(1, Math.floor(Math.random() * 5))))].map((_, i) => (
                        <img
                          key={i}
                          src={`https://i.pravatar.cc/32?img=${i + 1}`}
                          alt={`Assignee ${i + 1}`}
                          className="w-7 h-7 rounded-full border-2 border-white"
                        />
                      ))}
                      {task.assignees.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                          +{task.assignees.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs text-gray-500">{formatDate(task.created_at)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs text-gray-500">{formatDate(task.deadline)}</div>
                  </td>
                  <td className="py-4 px-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;