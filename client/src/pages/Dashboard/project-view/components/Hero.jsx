// Hero.js
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// import AddTaskModal from './AddTaskModal';
import { useRecoilValue } from 'recoil';
import { sidebarSelection } from '../../../../store/atoms/adminDashboardAtoms';
import AddTaskModal from '../task/AddTaskModal';

const Hero = ({ sidebarOpen, setSidebarOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSidebar = useRecoilValue(sidebarSelection);

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
  const closeModal = () => setIsModalOpen(false);

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
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
            <div>
              <h1 className="text-2xl font-semibold">{projectName}</h1>
              <p className="text-gray-600 text-sm mt-2">
                  <span className={`px-2 py-1 ${getPriorityColor()} rounded-full`}>
                      {projectPriority}
                  </span>
                </p> 
              <p className="text-gray-600 text-sm mt-2">{projectDescription}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {projectTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-violet-300 text-violet-950 rounded-lg text-xs font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
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

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Hero;
