import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRecoilValue } from 'recoil';
import { sidebarSelection } from '../../../../store/atoms/adminDashboardAtoms';
import AddTaskModal from '../task/AddTaskModal';
import TaskTable from '../table/TaskTable';
import UserTable from '../table/UserTable';
import FileTable from '../table/FileTable';

const Hero = ({ sidebarOpen, setSidebarOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSidebar = useRecoilValue(sidebarSelection);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Project state initialization
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectPriority, setProjectPriority] = useState('');
  const [projectTags, setProjectTags] = useState([]);

  // Fetch project details from localStorage on component mount
  useEffect(() => {
    setProjectName(localStorage.getItem('project_name') || '');
    setProjectDescription(localStorage.getItem('project_description') || '');
    setProjectPriority(localStorage.getItem('project_priority') || '');
    const tags = localStorage.getItem('project_tags')?.split(',') || [];
    setProjectTags(tags);
  }, []);

  // Open and close modal for adding a task
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Get color based on project priority
  const getPriorityColor = () => {
    switch (projectPriority.toLowerCase()) {
      case 'low':
        return 'bg-green-300 text-green-800';
      case 'medium':
        return 'bg-yellow-300 text-yellow-800';
      case 'high':
        return 'bg-red-300 text-red-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4 max-w-[800px]">
          {/* Sidebar toggle button for mobile */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="space-y-3 flex-1 min-w-0">
            {/* Project Name and Priority in one line */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold">{projectName}</h1>
              <span className={`px-3 py-1 ${getPriorityColor()} rounded-full text-sm font-medium whitespace-nowrap`}>
                {projectPriority}
              </span>
            </div>
            
            {/* Project Description with word wrapping */}
            {projectDescription && (
              <p className="text-gray-600 break-words whitespace-pre-wrap">
                {projectDescription}
              </p>
            )}
            
            {/* Display project tags if available */}
            {projectTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {projectTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-violet-100 text-violet-800 rounded-lg text-sm font-medium whitespace-nowrap"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Task button aligned to top right */}
        <button
          className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap self-start mt-6 lg:static "
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="inline-flex">Add Task</span>
        </button>
      </div>

      {/* Task, User, and File Tables */}
      <TaskTable refreshTrigger={refreshTrigger} />
      <UserTable />
      
      {/* Add spacing between User Table and File Table */}
      <div className="my-6" />
      
      <FileTable />

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Hero;
