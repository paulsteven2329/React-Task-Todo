// frontend/src/components/TaskForm.js
import { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tasks', { title, description, category });
      onTaskAdded(res.data);
      setTitle('');
      setDescription('');
      setCategory('other');
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to add task';
      const errorDetails = err.response?.data?.details || '';
      setError(`${errorMsg}${errorDetails ? `: ${errorDetails}` : ''}`);
      console.error('Add task error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Add Task</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-select"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Task</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;