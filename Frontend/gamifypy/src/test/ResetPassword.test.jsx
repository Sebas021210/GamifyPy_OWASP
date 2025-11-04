import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../components/ResetPassword';

// Mock fetch
globalThis.fetch = vi.fn();

// Mock logger
vi.mock('../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('ResetPassword Component', () => {
    const mockHandleClose = vi.fn();
    
    const defaultProps = {
        open: true,
        handleClose: mockHandleClose,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ csrf_token: 'test-csrf' }),
        });
    });

    it('should render when open is true', () => {
        render(<ResetPassword {...defaultProps} />);
        
        expect(screen.getByText(/Recuperar contraseña/i)).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
        render(<ResetPassword {...defaultProps} open={false} />);
        
        expect(screen.queryByText(/Recuperar contraseña/i)).not.toBeInTheDocument();
    });

    it('should update email input', () => {
        render(<ResetPassword {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/Correo electrónico/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        
        expect(emailInput.value).toBe('test@example.com');
    });

    it('should have Cancel and Send buttons', () => {
        render(<ResetPassword {...defaultProps} />);
        
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
    });

    it('should call handleClose when Cancel is clicked', () => {
        render(<ResetPassword {...defaultProps} />);
        
        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);
        
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it('should send reset password request on submit', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ csrf_token: 'test-csrf' }),
        });
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Email sent' }),
        });

        render(<ResetPassword {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/Correo electrónico/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        
        const sendButton = screen.getByRole('button', { name: /enviar/i });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://localhost:8000/auth/forgot-password',
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });
    });

    it('should fetch CSRF token on mount', async () => {
        render(<ResetPassword {...defaultProps} />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8000/csrf/get-csrf-token');
        });
    });
});
