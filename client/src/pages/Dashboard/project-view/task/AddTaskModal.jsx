// AddTaskModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTaskModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('1'); // Default medium priority
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    const projectId = localStorage.getItem('project_id');
    const token = localStorage.getItem('token');
    const creatorId = localStorage.getItem('userEmail');

    try {
      const response = await axios.post(`http://localhost:3001/task/project/${projectId}/create-task`, {
        title,
        description,
        deadline,
        status: '0',
        priority,
        creator_id: creatorId,
      }, {
        headers: { Authorization: token }
      });

      if (response.status === 201) {
        toast.success('Task created successfully!');
        onClose();
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) toast.error('Invalid task data. Please check the details.');
        else if (status === 404) toast.error('Project not found.');
        else if (status === 500) toast.error('Server error. Please try again later.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-700">✕</button>

            <form onSubmit={handleSubmit}>
              {/* Task Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="Enter task title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter task description"
                />
              </div>

              {/* Deadline */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Priority */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="0">Low</option>
                  <option value="1">Medium</option>
                  <option value="2">High</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskModal;
