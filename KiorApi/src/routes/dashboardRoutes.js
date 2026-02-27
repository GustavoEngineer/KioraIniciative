const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Endpoint principal
router.get('/', dashboardController.getDashboardSummary);

module.exports = router;
