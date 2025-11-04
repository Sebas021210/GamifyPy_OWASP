import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Levels from '../view/levels/levels';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock PythonLevelsMap component
vi.mock('../components/PythonLevelsMap', () => ({
    default: () => <div data-testid="python-levels-map">Python Levels Map</div>
}));

describe('Levels Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLevels = () => {
        return render(
            <BrowserRouter>
                <Levels />
            </BrowserRouter>
        );
    };

    it('should render the component', () => {
        renderLevels();
        expect(screen.getByTestId('python-levels-map')).toBeInTheDocument();
    });

    it('should render PythonLevelsMap component', () => {
        renderLevels();
        expect(screen.getByText('Python Levels Map')).toBeInTheDocument();
    });
});
