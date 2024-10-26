import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react';

// Toast component remains the same as in TaskTable
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
      {message}
    </div>
  );
};

const MyTasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [projectNames, setProjectNames] = useState({});

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Fetch project names
  const fetchProjectName = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3001/project/${projectId}`,
        {
          headers: {
            'authorization': token,
          }
        }
      );
      return response.data.name;
    } catch (error) {
      return 'Unknown Project';
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:3001/task/user/${userId}/assigned-tasks`,
        {
          headers: {
            'authorization': token,
          }
        }
      );
      
      // Fetch project names for all unique projects
      const uniqueProjectIds = [...new Set(response.data.map(task => task.project_id))];
      const projectNamePromises = uniqueProjectIds.map(async (projectId) => {
        const name = await fetchProjectName(projectId);
        return [projectId, name];
      });
      
      const projectNameEntries = await Promise.all(projectNamePromises);
      const projectNameMap = Object.fromEntries(projectNameEntries);
      setProjectNames(projectNameMap);

      // Group tasks by project
      const sortedTasks = response.data.sort((a, b) => {
        // First sort by project_id
        const projectCompare = a.project_id.localeCompare(b.project_id);
        if (projectCompare !== 0) return projectCompare;
        
        // Then sort by priority (high to low)
        const priorityCompare = b.priority.localeCompare(a.priority);
        if (priorityCompare !== 0) return priorityCompare;
        
        // Finally sort by deadline
        return new Date(a.deadline) - new Date(b.deadline);
      });

      setTasks(sortedTasks);
      setFilteredTasks(sortedTasks);
      setLoading(false);
      showToast("Tasks loaded successfully", "success");
    } catch (error) {
      setLoading(false);
      showToast("Failed to fetch tasks", "error");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = tasks.filter((task) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(lowerCaseQuery) ||
        task.description.toLowerCase().includes(lowerCaseQuery) ||
        projectNames[task.project_id]?.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredTasks(filtered);
  };

  const toggleProject = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Helper functions from original TaskTable
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

  // Group tasks by project
  const tasksByProject = filteredTasks.reduce((acc, task) => {
    const projectId = task.project_id;
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push(task);
    return acc;
  }, {});

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
        <div className="hidden lg:block font-medium text-lg">My Tasks</div>
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

      <div className="space-y-6">
        {Object.entries(tasksByProject).map(([projectId, projectTasks]) => (
          <div key={projectId} className="border rounded-lg overflow-hidden">
            <div
              className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleProject(projectId)}
            >
              <div className="flex items-center gap-2">
                {expandedProjects.has(projectId) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <h3 className="font-medium">{projectNames[projectId]}</h3>
                <span className="text-sm text-gray-500">({projectTasks.length} tasks)</span>
              </div>
            </div>

            {expandedProjects.has(projectId) && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="text-left py-4 px-6 font-medium text-xs">Task</th>
                      <th className="text-left py-4 px-6 font-medium text-xs">Description</th>
                      <th className="text-left py-4 px-6 font-medium text-xs">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-xs">Priority</th>
                      <th className="text-left py-4 px-6 font-medium text-xs">Created</th>
                      <th className="text-left py-4 px-6 font-medium text-xs">Deadline</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectTasks.map((task) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasksTable;