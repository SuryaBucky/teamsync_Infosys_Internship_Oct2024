// Hero.jsx
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRecoilValue } from 'recoil';
import { sidebarSelection } from '../../../../store/atoms/adminDashboardAtoms';
import AddTaskModal from '../task/AddTaskModal';
import TaskTable from '../table/TaskTable';

const Hero = ({ sidebarOpen, setSidebarOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSidebar = useRecoilValue(sidebarSelection);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectPriority, setProjectPriority] = useState('');
  const [projectTags, setProjectTags] = useState([]);

  useEffect(() => {
    setProjectName(localStorage.getItem('project_name') || '');
    setProjectDescription(localStorage.getItem('project_description') || '');
    setProjectPriority(localStorage.getItem('project_priority') || '');
    const tags = localStorage.getItem('project_tags')?.split(',') || [];
    setProjectTags(tags);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Trigger a refresh of the task table
    setRefreshTrigger(prev => prev + 1);
  };

  const getPriorityColor = () => {
    switch (projectPriority.toLowerCase()) {
      case 'low':
        return 'bg-green-300';
      case 'medium':
        return 'bg-yellow-300';
      case 'high':
        return 'bg-red-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex flex-col items-center text-center w-full"> {/* Centering container */}
          {/* Project Name Styling */}
          <h1 className="text-3xl font-bold text-blue-900">{projectName}</h1>

          {/* Project Priority Styling */}
          <p className="text-gray-600 text-sm mt-2">
            <span className={`px-2 py-1 ${getPriorityColor()} text-white font-semibold rounded-full`}>
              {projectPriority}
            </span>
          </p> 
          
          {/* Project Description Styling */}
          <p className="text-gray-700 text-sm mt-2 italic">{projectDescription}</p>
          
          {/* Project Tags Styling */}
          <div className="flex flex-wrap gap-2 mt-2">
            {projectTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-violet-300 text-violet-950 rounded-lg text-xs font-medium border border-violet-500 shadow-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      <TaskTable refreshTrigger={refreshTrigger} />

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Hero;
