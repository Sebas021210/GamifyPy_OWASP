import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LevelView from '../view/LevelView/LevelView';

// Mock LevelContent component
vi.mock('../components/LevelContent', () => ({
    default: () => <div>Level Content</div>
}));

// Mock useParams
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ id: '1' })
    };
});

describe('LevelView Component', () => {
    const renderLevelView = () => {
        return render(
            <BrowserRouter>
                <LevelView />
            </BrowserRouter>
        );
    };

    it('should render level view', () => {
        const { container } = renderLevelView();
        expect(container).toBeTruthy();
    });

    it('should be a valid component', () => {
        expect(LevelView).toBeDefined();
        expect(typeof LevelView).toBe('function');
    });

    it('should import successfully', async () => {
        const module = await import('../view/LevelView/LevelView');
        expect(module.default).toBeDefined();
    });
});
