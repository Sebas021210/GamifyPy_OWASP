import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TokenVerificationModal from '../components/TokenVerificationModal';

describe('TokenVerificationModal Component', () => {
    const mockHandleClose = vi.fn();
    const mockHandleVerify = vi.fn();
    
    const defaultProps = {
        open: true,
        handleClose: mockHandleClose,
        handleVerify: mockHandleVerify,
    };

    it('should render when open is true', () => {
        render(<TokenVerificationModal {...defaultProps} />);
        
        expect(screen.getByText('Verifica tu cuenta')).toBeInTheDocument();
        expect(screen.getByText(/Se ha enviado un token/i)).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
        render(<TokenVerificationModal {...defaultProps} open={false} />);
        
        expect(screen.queryByText('Verifica tu cuenta')).not.toBeInTheDocument();
    });

    it('should have Cancel and Confirm buttons', () => {
        render(<TokenVerificationModal {...defaultProps} />);
        
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    });

    it('should call handleClose when Cancel button is clicked', () => {
        render(<TokenVerificationModal {...defaultProps} />);
        
        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);
        
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it('should have Confirm button disabled initially', () => {
        render(<TokenVerificationModal {...defaultProps} />);
        
        const confirmButton = screen.getByRole('button', { name: /confirmar/i });
        expect(confirmButton).toBeDisabled();
    });

    it('should display verification instructions', () => {
        render(<TokenVerificationModal {...defaultProps} />);
        
        expect(screen.getByText(/token de verificación a tu correo/i)).toBeInTheDocument();
    });
});
