require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de Kiora V1 corriendo en http://localhost:${PORT}`);
});
