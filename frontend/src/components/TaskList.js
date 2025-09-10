// frontend/src/components/TaskList.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch tasks');
        console.error('Fetch tasks error:', err.response?.data || err.message);
      }
    };
    fetchTasks();

    socket.on('connect', () => console.log('Socket.io connected'));
    socket.on('connect_error', (err) => console.error('Socket.io error:', err));
    socket.on('taskCreated', (newTask) => setTasks((prev) => [...prev, newTask]));
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    });
    socket.on('taskDeleted', (id) => setTasks((prev) => prev.filter((t) => t._id !== id)));

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`/api/tasks/${task._id}`, { ...task, completed: !task.completed });
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update task');
    }
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.title} <span className="badge bg-secondary">{task.category}</span></h5>
              <p>{task.description}</p>
            </div>
            <div>
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;