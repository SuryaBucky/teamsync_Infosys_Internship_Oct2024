import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CheckCircle, XCircle, X } from 'lucide-react';
import { SearchBar } from './common/SearchBar';
import toast from 'react-simple-toasts';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/admin/all-users', {
          headers: { 'authorization': token, 'Content-Type': 'application/json' },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) => user.name.toLowerCase().includes(lowerCaseQuery) || user.email.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const toggleModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(!isModalOpen);
  };

  const handleStateChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = selectedUser.id;
      const newState = selectedUser.state === 'verified' ? 'blocked' : 'verified';

      await axios.put(
        'http://localhost:3001/admin/user-state',
        { user_id: userId },
        { headers: { authorization: token } }
      );

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, state: newState } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      toast(`User ${newState === 'verified' ? 'unblocked' : 'blocked'} successfully!`);
      setIsModalOpen(false);
    } catch (error) {
      toast(error.response ? error.response.data.message : 'Something went wrong!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4 text-center">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Users</h1>

        <div className="flex gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <SearchBar placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </form>
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left py-4 px-6 font-medium text-xs">Username</th>
                <th className="text-left py-4 px-6 font-medium text-xs">Email</th>
                <th className="text-left py-4 px-6 font-medium text-xs">Joined On</th>
                <th className="text-left py-4 px-6 font-medium text-xs">State</th>
                <th className="text-left py-4 px-6 font-medium text-xs">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-4 px-6"><div className="font-medium text-sm">{user.name}</div></td>
                    <td className="py-4 px-6"><div className="text-sm text-gray-600">{user.email}</div></td>
                    <td className="py-4 px-6"><div className="text-sm text-gray-500">{formatDate(user.created_at)}</div></td>
                    <td className="py-4 px-6">
                      {user.state === 'verified' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleModal(user)}
                        className={`px-4 py-2 rounded-md text-white ${
                          user.state === 'verified' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {user.state === 'verified' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg p-6 w-96 max-w-[90%] shadow-xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
            <p className="text-sm mb-6">
              Are you sure you want to {selectedUser?.state === 'verified' ? 'block' : 'unblock'} user <strong>{selectedUser?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleStateChange} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
