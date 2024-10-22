import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Filter } from 'lucide-react';
import { SearchBar } from './common/SearchBar';
import { TableHeader } from './table/TableHeader';
import { ProjectRow } from './table/ProjectRow';

const ProjectTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]); // State to store projects
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchProjects = async () => {
      console.log("fetching");
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await axios.get('http://localhost:3001/project/get-my-assigned-projects', {
          headers: {
            'authorization': token, // Set Authorization header
            'Content-Type': 'application/json' // Set content type
          },
        });

        setProjects(response.data); // Set the projects state
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProjects(); // Call the function to fetch projects
  }, []);

  // If loading, display a loading message
  if (loading) {
    return <div>Loading projects...</div>;
  }

  // If there's an error, display an error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="hidden lg:block font-medium text-lg">Table view</div>
        <div className="flex gap-4">
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
