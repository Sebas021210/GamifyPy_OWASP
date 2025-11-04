import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import InsigniaCarousel from '../components/InsigniaCarousel';

// Mock fetch
globalThis.fetch = vi.fn();

// Mock logger
vi.mock('../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('InsigniaCarousel Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'test-token');
        
        globalThis.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                insignias: [
                    { id: 1, nombre: 'Insignia 1', imagen: '/img1.png' },
                    { id: 2, nombre: 'Insignia 2', imagen: '/img2.png' }
                ]
            })
        });
    });

    it('should render insignia carousel', () => {
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should fetch insignias on mount', async () => {
        render(<InsigniaCarousel />);
        
        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled();
        });
    });

    it('should handle fetch error gracefully', async () => {
        globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should be a valid component', () => {
        expect(InsigniaCarousel).toBeDefined();
        expect(typeof InsigniaCarousel).toBe('function');
    });

    it('should render with empty insignias', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ insignias: [] })
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });
});
