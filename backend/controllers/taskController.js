// backend/controllers/taskController.js (relevant part)
exports.createTask = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    if (!req.io) {
      console.error('createTask: req.io is undefined');
      return res.status(500).json({ msg: 'Socket.io not initialized' });
    }
    const task = new Task({ title, description, category, user: req.user.id });
    await task.save();
    console.log('Task created:', task);
    req.io.emit('taskCreated', task);
    res.status(201).json(task);
  } catch (err) {
    console.error('createTask error:', err.message);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
};