import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { isValidEmail } from '../../../../../common/utils/validations';

/**
 * Hook to manage login form state and logic
 */
export const useLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            window.alert('Por favor, completa todos los campos.');
            return;
        }

        if (!isValidEmail(formData.email)) {
            window.alert('El formato del correo no es válido.');
            return;
        }

        setLoading(true);
        setError(null);

        const { data, error: loginError } = await authService.loginUser(
            formData.email,
            formData.password
        );

        setLoading(false);

        if (loginError) {
            // Manejamos errores comunes de Supabase Auth
            if (loginError.status === 400 || loginError.message.includes('Invalid login credentials')) {
                window.alert('Usuario o contraseña incorrectos. Por favor, verifica tus datos.');
                setError('Credenciales inválidas.');
            } else {
                window.alert(`Error: ${loginError.message}`);
                setError(loginError.message);
            }
        } else {
            navigate('/dashboard/cover');
        }
    };

    return {
        formData,
        loading,
        error,
        handleChange,
        handleSubmit
    };
};
