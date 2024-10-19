import { useState, useEffect } from 'react';
import { projectService } from '../services/api';

export const useProjects = (searchQuery = '') => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = searchQuery 
          ? await projectService.searchProjects(searchQuery)
          : await projectService.getAllProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search queries
    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return { projects, loading, error };
};
