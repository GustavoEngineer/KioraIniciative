const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/me', profileController.getMyProfile);

module.exports = router;
