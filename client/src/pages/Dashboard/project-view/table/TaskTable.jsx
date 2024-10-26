import React, { useState, useEffect } from 'react';
import { Filter, MoreVertical, Trash2, X } from 'lucide-react';
import axios from 'axios';

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

const DeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg p-6 w-96 max-w-[90%] shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Delete Task</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskTable = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: ''
  });

  // Create axios instance with default config
  const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  });

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleDeleteClick = (taskId, taskTitle) => {
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle
    });
  };

  const handleDeleteConfirm = async () => {
    const taskId = deleteModal.taskId;
    try {
      const projectId = localStorage.getItem('project_id');
      
      await api.delete(`/task/project/${projectId}/delete-task/${taskId}`);
      
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      showToast("Task deleted successfully", "success");
    } catch (error) {
      console.error('Delete task error:', error);
      showToast("Failed to delete task", "error");
    } finally {
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });
    }
  };

  const fetchTasks = async () => {
    try {
      const projectId = localStorage.getItem('project_id');
      
      const { data } = await api.get(`/task/project/${projectId}/view-tasks`);
      
      setTasks(data);
      setFilteredTasks(data);
      setLoading(false);
      showToast("Tasks loaded successfully", "success");
    } catch (error) {
      console.error('Fetch tasks error:', error);
      setLoading(false);
      showToast("Failed to fetch tasks", "error");
    }
  };

  // Rest of the component remains exactly the same
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "0": return "bg-gray-100 text-gray-800";
      case "1": return "bg-blue-100 text-blue-800";
      case "2": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "0": return "bg-blue-100 text-blue-800";
      case "1": return "bg-yellow-100 text-yellow-800";
      case "2": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "0": return "To Do";
      case "1": return "In Progress";
      case "2": return "Completed";
      default: return "Unknown";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "0": return "Low";
      case "1": return "Medium";
      case "2": return "High";
      default: return "Unknown";
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

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' })}
        onConfirm={handleDeleteConfirm}
        taskTitle={deleteModal.taskTitle}
      />

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
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => handleDeleteClick(task._id, task.title)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors duration-200"
                      title="Delete task"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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
                <td colSpan="9" className="text-center py-4">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;