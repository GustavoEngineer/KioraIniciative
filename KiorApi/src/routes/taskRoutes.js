const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const taskController = require('../controllers/taskController');

// Subtasks routes handler for /api/tasks/:taskId/subtasks is actually in subtask controller/router, we will handle that separately, or we can mount it here
const subtaskController = require('../controllers/subtaskController'); // We'll create this file next

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Rutas anidadas de subtareas (creación dependiente de la tarea)
router.post('/:taskId/subtasks', subtaskController.createSubtask);

module.exports = router;
