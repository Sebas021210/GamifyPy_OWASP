import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../view/home/home';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Home Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '<div id="root"></div>';
    });

    const renderHome = () => {
        return render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
    };

    it('should render GamifyPy logo', () => {
        renderHome();
        expect(screen.getByText('GamifyPy')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
        renderHome();
        expect(screen.getByText(/Domina Python jugando/i)).toBeInTheDocument();
    });

    it('should render terminal header', () => {
        renderHome();
        expect(screen.getByText(/Iniciando misión Python/i)).toBeInTheDocument();
    });

    it('should render start adventure button', () => {
        renderHome();
        expect(screen.getByRole('button', { name: /Comenzar Aventura/i })).toBeInTheDocument();
    });

    it('should navigate to auth when button is clicked', () => {
        renderHome();
        
        const button = screen.getByRole('button', { name: /Comenzar Aventura/i });
        fireEvent.click(button);
        
        expect(mockNavigate).toHaveBeenCalledWith('/auth', { replace: true });
    });

    it('should render terminal code lines', () => {
        renderHome();
        
        expect(screen.getByText(/def iniciar_aventura/i)).toBeInTheDocument();
        expect(screen.getByText(/experiencia = 0/i)).toBeInTheDocument();
        expect(screen.getByText(/nivel = "Principiante"/i)).toBeInTheDocument();
    });

    it('should render particles container', () => {
        const { container } = renderHome();
        
        const particlesContainer = container.querySelector('.particles');
        expect(particlesContainer).toBeInTheDocument();
    });

    it('should render welcome message in terminal', () => {
        renderHome();
        expect(screen.getByText(/¡Bienvenido a Gamify.Py!/i)).toBeInTheDocument();
    });

    it('should render adventure started message', () => {
        renderHome();
        expect(screen.getByText(/Aventura iniciada/i)).toBeInTheDocument();
    });
});
