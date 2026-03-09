import { useState } from 'react';
import { authService } from '../services/authService';
import { isValidEmail, hasMinLength, doPasswordsMatch } from '../../../common/utils/validations';

/**
 * Hook to manage registration form state and logic
 */
export const useRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Resetear el error cuando el usuario empiece a escribir nuevamente
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!hasMinLength(formData.fullName, 3)) {
            return "El nombre debe tener al menos 3 caracteres.";
        }
        if (!isValidEmail(formData.email)) {
            return "Por favor ingresa un correo electrónico válido.";
        }
        if (!hasMinLength(formData.password, 6)) {
            return "La contraseña debe tener al menos 6 caracteres.";
        }
        if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
            return "Las contraseñas no coinciden.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const { data, error: supabaseError } = await authService.registerUser(
            formData.email,
            formData.password,
            formData.fullName
        );

        setLoading(false);

        if (supabaseError) {
            // Manejar errores comunes
            if (supabaseError.status === 422 || supabaseError.message.includes('User already registered')) {
                setError('Este correo electrónico ya está registrado.');
            } else {
                setError(supabaseError.message);
            }
        } else {
            setSuccess(true);
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        }
    };

    return {
        formData,
        loading,
        error,
        success,
        handleChange,
        handleSubmit
    };
};
