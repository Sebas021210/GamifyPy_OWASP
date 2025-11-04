import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../view/auth/auth';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock logger
vi.mock('../utils/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}));

// Mock ResetPassword component
vi.mock('../components/ResetPassword', () => ({
  default: ({ open, handleClose }) => open ? (
    <div data-testid="reset-password-modal">
      <button onClick={handleClose}>Close Reset</button>
    </div>
  ) : null
}));

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn();
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    expect(screen.getByText('GamifyPy')).toBeInTheDocument();
    expect(screen.getByText('¡Bienvenido de regreso!')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('should handle email input change', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Correo Electrónico');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should handle password input change', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Contraseña');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  it('should toggle password visibility', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Contraseña');
    const toggleButton = screen.getByLabelText('Mostrar contraseña');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should handle successful login', async () => {
    const mockResponse = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Correo Electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const loginButton = screen.getByText('Iniciar Sesión');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      );
    });

    expect(localStorage.getItem('token')).toBe('test-access-token');
    expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
    expect(mockNavigate).toHaveBeenCalledWith('/levels', { replace: true });
  });

  it('should handle login error', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Invalid credentials' })
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const loginButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(loginButton);

    await waitFor(() => {
      const emailInput = screen.getByLabelText('Correo Electrónico');
      expect(emailInput.value).toBe('');
    });

    consoleSpy.mockRestore();
  });

  it('should navigate to register page', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const registerLink = screen.getByText('Regístrate');
    fireEvent.click(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('/register', { replace: true });
  });

  it('should handle Google login', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const googleButton = screen.getByText('Continuar con Google');
    fireEvent.click(googleButton);

    expect(window.location.href).toBe('http://localhost:8000/auth/login/google');
  });

  it('should render all UI elements', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    expect(screen.getByText('Ingresa tus credenciales para acceder a tu cuenta')).toBeInTheDocument();
    expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByText('o')).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });
});
