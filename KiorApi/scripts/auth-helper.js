const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function getTestToken() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'gus@example.com', // El usuario que creaste en el Dashboard
        password: 'Password123!',
    });

    if (error) {
        console.error('Error obteniendo el token:', error.message);
        return;
    }

    console.log('--- COPIA ESTE TOKEN PARA TUS PRUEBAS ---');
    console.log(data.session.access_token);
    console.log('-----------------------------------------');
}

getTestToken();
