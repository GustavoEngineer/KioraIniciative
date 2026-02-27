const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const subtaskController = require('../controllers/subtaskController');

// Nota: POST /api/tasks/:taskId/subtasks está mapeado en taskRoutes.js para respetar
// la jerarquía visual de URLs, pero estos gestionan la subtarea directamente por su ID propio.

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.patch('/:id', subtaskController.updateSubtask);
router.delete('/:id', subtaskController.deleteSubtask);

module.exports = router;
