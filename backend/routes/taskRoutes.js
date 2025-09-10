// backend/routes/taskRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth'); // Use singular 'middleware'
const taskController = require('../controllers/taskController');

const router = express.Router();

router.get('/', authMiddleware, taskController.getTasks);
router.post('/', authMiddleware, taskController.createTask);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;