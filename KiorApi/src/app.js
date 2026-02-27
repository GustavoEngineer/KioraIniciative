const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const tagRoutes = require('./routes/tagRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Definición de Rutas
app.use('/api/tags', tagRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
