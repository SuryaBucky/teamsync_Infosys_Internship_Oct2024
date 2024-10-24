import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, X, Loader } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ProjectRow = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const formattedDeadline = new Date(project.deadline).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/admin/all-users-Users', {
        headers: { authorization: token }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users. Please try again later.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleAddUsers = async () => {
    if (!project.is_approved) {
      toast.warning('Please verify the project first and then try adding users.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setIsModalOpen(true);
    fetchUsers();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/project/addUsers', 
        {
          project_id: project.id,
          user_ids: selectedUsers.map(user => user.id)
        },
        {
          headers: { Authorization: token }
        }
      );
      
      toast.success('Users added successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setIsModalOpen(false);
      // Wait for toast to be visible before reloading
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Error adding users. Please try again later.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userToRemove.id));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <tr className="border-b last:border-b-0 hover:bg-gray-50">
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium text-sm md:text-md line-clamp-1">{project.name}</div>
              <div className="text-xs text-gray-500">{project.name}</div>
            </div>
          </div>
        </td>
        <td className="py-4 px-2">
          {project.is_approved ? (
            <span className="inline-flex justify-center items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              {project.status}
            </span>
          ) : (
            <span className="inline-flex justify-center items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
              Not Approved
            </span>
          )}
        </td>
        <td className="hidden sm:table-cell py-4 px-4 text-black text-xs">
          <div className="max-w-[200px] truncate" title={project.description}>
            {project.description}
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="flex -space-x-2">
            {[...Array(Math.min(3, project.noUsers))].map((_, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/32?img=${i + 1}`}
                alt={`Member ${i + 1}`}
                className="w-7 h-7 rounded-full border-2 border-white"
              />
            ))}
            {project.noUsers > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                +{project.noUsers - 3}
              </div>
            )}
          </div>
        </td>
        <td className="py-4 px-4">
          <ProgressBar progress={project.progress || 0} />
        </td>
        <td className="py-4 ps-7 px-4">
          <div className="text-xs text-gray-500">{formattedDeadline}</div>
        </td>
        <td className="py-4 px-2 relative" ref={dropdownRef}>
          <button 
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleAddUsers}
                >
                  Add Users
                </button>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div 
                className="bg-white rounded-lg p-6 w-[425px] max-w-full mx-4"
                ref={modalRef}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add users to {project.name}</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      {user.name}
                      <button
                        onClick={() => removeUser(user)}
                        className="hover:bg-gray-200 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="relative mb-4">
                  <button
                    className="w-full px-4 py-2 text-left border rounded-md hover:bg-gray-50"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    Select users
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-20">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full px-4 py-2 border-b"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="max-h-[240px] overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No users found
                          </div>
                        ) : (
                          filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() => {
                                if (!selectedUsers.find(u => u.id === user.id)) {
                                  setSelectedUsers([...selectedUsers, user]);
                                }
                                setIsUserDropdownOpen(false);
                              }}
                            >
                              {user.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || selectedUsers.length === 0}
                  className={`w-full py-2 px-4 rounded-md text-white ${
                    isLoading || selectedUsers.length === 0
                      ? 'bg-gray-400'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Loading...
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

export default ProjectRow;