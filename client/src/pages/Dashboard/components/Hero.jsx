import React, { useState } from 'react';
import { Menu, Search, Filter } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ProjectTable from './ProjectTable';

const Hero = ({ sidebarOpen, setSidebarOpen }) => {
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
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-gray-600 text-sm mt-1">
              View and Manage Your Teams Projects
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors">
          <FontAwesomeIcon icon={faPlus} />
          <span className="hidden sm:inline">Add Project</span>
        </button>
      </div>

      {/* Project Table */}
      <ProjectTable />
    </div>
  );
};

export default Hero;