import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFolder, faTasks, faFileAlt, faUsers, faLifeRing } from '@fortawesome/free-solid-svg-icons';

const IconItem = ({ icon, label }) => {
  return (
    <a
      href="#"
      className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
    >
      <FontAwesomeIcon icon={icon} className="w-5 h-5 text-gray-700 transition duration-75 group-hover:text-gray-900" />
      <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
    </a>
  );
};

const Sidebar = () => {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-56 h-screen pt-8 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 relative"
      aria-label="Sidebar"
    >
      <div className='flex justify-center items-center'>
        <div className='text-3xl font-bold'>Team Sync</div>
      </div>
      <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mt-4 mx-6"></div>
      <div className="px-3 pb-4 mt-6 overflow-y-auto w-48 bg-white">
        <ul className="space-y-2 font-medium">
          <li><IconItem icon={faHome} label="Home" /></li>
          <li><IconItem icon={faFolder} label="Projects" /></li>
          <li><IconItem icon={faTasks} label="Tasks" /></li>
          <li><IconItem icon={faFileAlt} label="File Manager" /></li>
          <li><IconItem icon={faUsers} label="Users" /></li>
          <li><IconItem icon={faLifeRing} label="Support" /></li>
        </ul>
      </div>
      

      {/* Profile Section at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 rounded-lg mx-1 mb-4">
      <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mt-8 mb-4"></div>
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" // Your profile image source
            alt="User Profile"
          />
          <div className="ml-3">
            <p className="font-semibold text-gray-800">Neil Sims</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
