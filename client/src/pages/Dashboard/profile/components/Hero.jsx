// Hero.js
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import ProjectTable from './ProjectTable';
import AddProjectModal from './profile/EditProfileModal';
import { sidebarSelection } from '../../../../store/atoms/adminDashboardAtoms';
import { useRecoilValue } from 'recoil';
import UsersProfile from './UsersProfile';

const Hero = ({ sidebarOpen, setSidebarOpen, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSidebar = useRecoilValue(sidebarSelection);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            <h1 className="text-2xl font-semibold">{`Hi, ${user.name}`}</h1>
            <p className="text-gray-600 text-sm mt-1">
              {user.email}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
          onClick={openModal} // Open modal on click
        >
          <FontAwesomeIcon icon={faPen} />
          <span className="hidden sm:inline">Edit Profile</span>
        </button>
      </div>

      {/* Project Table */}
      
      {selectedSidebar === 'users' && <UsersProfile />}
      {selectedSidebar === 'projects' && <ProjectTable />}

      {/* Add Project Modal */}
      <AddProjectModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Hero;
