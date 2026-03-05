const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const tagController = require('../controllers/tagController');

// Todas las rutas de tags requieren autenticación
router.use(authMiddleware);

router.get('/', tagController.getTags);
router.get('/:id', tagController.getTagById);
router.post('/', tagController.createTag);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;
