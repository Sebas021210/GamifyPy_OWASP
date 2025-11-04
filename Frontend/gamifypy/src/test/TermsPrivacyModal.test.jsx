import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TermsPrivacyModal from '../components/TermsPrivacyModal';

describe('TermsPrivacyModal Component', () => {
    const mockHandleClose = vi.fn();
    
    const defaultProps = {
        open: true,
        handleClose: mockHandleClose,
        title: 'Test Title',
        content: 'Test content here',
    };

    it('should render when open is true', () => {
        render(<TermsPrivacyModal {...defaultProps} />);
        
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test content here')).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
        render(<TermsPrivacyModal {...defaultProps} open={false} />);
        
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should display the correct title', () => {
        render(<TermsPrivacyModal {...defaultProps} title="Términos y Condiciones" />);
        
        expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
    });

    it('should display the correct content', () => {
        const content = 'Este es el contenido de prueba';
        render(<TermsPrivacyModal {...defaultProps} content={content} />);
        
        expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('should call handleClose when close button is clicked', () => {
        render(<TermsPrivacyModal {...defaultProps} />);
        
        const closeButton = screen.getByRole('button', { name: /cerrar/i });
        fireEvent.click(closeButton);
        
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it('should call handleClose when backdrop is clicked', () => {
        const { container } = render(<TermsPrivacyModal {...defaultProps} />);
        
        // MUI Dialog backdrop
        const backdrop = container.querySelector('.MuiBackdrop-root');
        if (backdrop) {
            fireEvent.click(backdrop);
            expect(mockHandleClose).toHaveBeenCalled();
        }
    });

    it('should render with empty content', () => {
        render(<TermsPrivacyModal {...defaultProps} content="" />);
        
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render long content correctly', () => {
        const longContent = 'A'.repeat(1000);
        render(<TermsPrivacyModal {...defaultProps} content={longContent} />);
        
        expect(screen.getByText(longContent)).toBeInTheDocument();
    });
});
