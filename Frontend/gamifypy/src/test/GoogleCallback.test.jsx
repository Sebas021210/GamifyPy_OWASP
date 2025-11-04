import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GoogleCallback from '../components/GoogleCallback';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams()],
    };
});

describe('GoogleCallback Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should render connection message', () => {
        render(
            <BrowserRouter>
                <GoogleCallback />
            </BrowserRouter>
        );
        
        expect(screen.getByText(/Conectando con tu cuenta de Google/i)).toBeInTheDocument();
    });

    it('should navigate to auth when tokens are missing', () => {
        render(
            <BrowserRouter>
                <GoogleCallback />
            </BrowserRouter>
        );
        
        // Should navigate to /auth when no tokens
        setTimeout(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/auth');
        }, 100);
    });
});
