import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProjectTable } from './ProjectTable';

const Hero = () => {
  return (
    <div className="p-4 sm: pt-4">
      <div className="p-4">
        <div className='flex justify-between'>
            <div>
                <div className='text-3xl font-semibold'>
                    Projects
                </div>
                <div className='text-gray-600 text-md pt-2'>
                    View and Manage Your Teams Projects
                </div>
            </div>
            <div>
                <button className="flex justify-center items-center bg-blue-950 text-white text-lg font-semibold px-4 rounded-lg hover:bg-blue-600 transition duration-200 w-50 h-12">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Project
                </button>
            </div>
        </div>
        <div>
          <ProjectTable />
        </div>
      </div>
    </div>
  );
};

export default Hero;
