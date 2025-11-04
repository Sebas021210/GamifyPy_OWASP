import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../view/auth/register';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('Register Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock CSRF token fetch
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ csrf_token: 'test-csrf-token' }),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const renderRegister = () => {
        return render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
    };

    it('debería renderizar el formulario de registro', () => {
        renderRegister();
        expect(screen.getByText(/Crea tu cuenta/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    it('debería mostrar error cuando los campos están vacíos', async () => {
        renderRegister();
        const registerButton = screen.getByRole('button', { name: /Registrarse/i });
        
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
        });
    });

    it('debería actualizar el campo de username', () => {
        renderRegister();
        const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
        
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        
        expect(usernameInput.value).toBe('testuser');
    });

    it('debería actualizar el campo de email', () => {
        renderRegister();
        const emailInput = screen.getByLabelText(/Correo electrónico/i);
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        
        expect(emailInput.value).toBe('test@example.com');
    });

    it('debería actualizar el campo de password', () => {
        renderRegister();
        const passwordInput = screen.getByLabelText(/^Contraseña$/i);
        
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        
        expect(passwordInput.value).toBe('Password123!');
    });

    it('debería actualizar el campo de confirmPassword', () => {
        renderRegister();
        const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
        
        fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
        
        expect(confirmPasswordInput.value).toBe('Password123!');
    });

    it('debería mostrar/ocultar password al hacer click en el icono', () => {
        renderRegister();
        const passwordInput = screen.getByLabelText(/^Contraseña$/i);
        const toggleButton = screen.getAllByRole('button')[0]; // Primer botón de visibilidad
        
        expect(passwordInput.type).toBe('password');
        
        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('text');
        
        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('password');
    });

    it('debería mostrar/ocultar confirmPassword al hacer click en el icono', () => {
        renderRegister();
        const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
        const toggleButtons = screen.getAllByRole('button');
        const confirmToggleButton = toggleButtons[1]; // Segundo botón de visibilidad
        
        expect(confirmPasswordInput.type).toBe('password');
        
        fireEvent.click(confirmToggleButton);
        expect(confirmPasswordInput.type).toBe('text');
    });

    it('debería mostrar error cuando las contraseñas no coinciden', async () => {
        renderRegister();
        
        const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
        const emailInput = screen.getByLabelText(/Correo electrónico/i);
        const passwordInput = screen.getByLabelText(/^Contraseña$/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
        const registerButton = screen.getByRole('button', { name: /Registrarse/i });
        
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword!' } });
        
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
        });
    });

    it('debería habilitar/deshabilitar checkbox de términos', () => {
        renderRegister();
        const checkbox = screen.getByRole('checkbox');
        
        expect(checkbox).not.toBeChecked();
        
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    it('debería navegar a login al hacer click en "Inicia sesión"', () => {
        renderRegister();
        const loginLink = screen.getByText(/Inicia sesión/i);
        
        fireEvent.click(loginLink);
        
        expect(mockNavigate).toHaveBeenCalledWith('/auth', { replace: true });
    });

    it('debería enviar PIN exitosamente con campos válidos', async () => {
        // Mock fetch para send-pin
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ csrf_token: 'test-csrf-token' }),
        });
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'PIN enviado' }),
        });

        renderRegister();
        
        const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
        const emailInput = screen.getByLabelText(/Correo electrónico/i);
        const passwordInput = screen.getByLabelText(/^Contraseña$/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
        const registerButton = screen.getByRole('button', { name: /Registrarse/i });
        
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
        
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://localhost:8000/auth/send-pin',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'test@example.com' }),
                })
            );
        });
    });

    it('debería manejar error al enviar PIN', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ csrf_token: 'test-csrf-token' }),
        });
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ detail: 'Error al enviar PIN' }),
        });

        renderRegister();
        
        const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
        const emailInput = screen.getByLabelText(/Correo electrónico/i);
        const passwordInput = screen.getByLabelText(/^Contraseña$/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
        const registerButton = screen.getByRole('button', { name: /Registrarse/i });
        
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
        
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/Error al enviar PIN/i)).toBeInTheDocument();
        });
    });

    it('debería cerrar el mensaje de error después de 3 segundos', async () => {
        vi.useFakeTimers();
        
        renderRegister();
        const registerButton = screen.getByRole('button', { name: /Registrarse/i });
        
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
        });

        vi.advanceTimersByTime(3000);

        await waitFor(() => {
            expect(screen.queryByText(/completa todos los campos/i)).not.toBeInTheDocument();
        });

        vi.useRealTimers();
    });

    it('debería abrir modal de términos y condiciones', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ csrf_token: 'test-csrf-token' }),
        });
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'Términos y condiciones de prueba',
        });

        renderRegister();
        
        const termsLink = screen.getByText(/Términos y Condiciones/i);
        fireEvent.click(termsLink);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith('/legal/terminos.txt');
        });
    });

    it('debería abrir modal de política de privacidad', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ csrf_token: 'test-csrf-token' }),
        });
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'Política de privacidad de prueba',
        });

        renderRegister();
        
        const privacyLink = screen.getByText(/Política de Privacidad/i);
        fireEvent.click(privacyLink);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith('/legal/politicas.txt');
        });
    });

    it('debería obtener CSRF token al montar el componente', async () => {
        renderRegister();

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8000/csrf/get-csrf-token');
        });
    });
});
