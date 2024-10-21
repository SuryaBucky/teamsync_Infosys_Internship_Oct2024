import { useState } from 'react';
import { Filter } from 'lucide-react';
import { projects } from '../data/projects';
import { SearchBar } from './common/SearchBar';
import { TableHeader } from './table/TableHeader';
import { ProjectRow } from './table/ProjectRow';

const ProjectTable = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="py-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
      <div className="hidden lg:block font-medium text-lg">Table view</div>
        <div className="flex gap  -4">
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <TableHeader />
          </thead>
          <tbody>
            {projects.map(project => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProjectTable;