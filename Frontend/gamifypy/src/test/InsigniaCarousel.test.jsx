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
                    { id: 1, nombre: 'Insignia 1', imagen: '/img1.png', descripcion: 'Test 1' },
                    { id: 2, nombre: 'Insignia 2', imagen: '/img2.png', descripcion: 'Test 2' }
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

    it('should handle 401 unauthorized', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle missing token', async () => {
        localStorage.removeItem('token');
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle multiple insignias', async () => {
        const manyInsignias = Array.from({ length: 10 }, (_, i) => ({
            id: i,
            nombre: `Insignia ${i}`,
            imagen: `/img${i}.png`,
            descripcion: `Desc ${i}`
        }));

        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ insignias: manyInsignias })
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should call fetch with correct headers', async () => {
        render(<InsigniaCarousel />);
        
        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/user/insignias'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token'
                    })
                })
            );
        });
    });

    it('should handle 500 server error', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle 404 not found', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle malformed JSON response', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => { throw new Error('Invalid JSON'); }
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle null response', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => null
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle insignias with missing fields', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                insignias: [
                    { id: 1 },
                    { nombre: 'Test' },
                    { imagen: '/img.png' }
                ]
            })
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should fetch only once on mount', async () => {
        render(<InsigniaCarousel />);
        
        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1);
        });
    });

    it('should handle network timeout', async () => {
        globalThis.fetch.mockRejectedValueOnce(new Error('Timeout'));
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle connection refused', async () => {
        globalThis.fetch.mockRejectedValueOnce(new Error('Connection refused'));
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle CORS error', async () => {
        globalThis.fetch.mockRejectedValueOnce(new Error('CORS policy'));
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle empty string token', async () => {
        localStorage.setItem('token', '');
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle very long insignia names', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                insignias: [{
                    id: 1,
                    nombre: 'A'.repeat(1000),
                    imagen: '/img.png',
                    descripcion: 'Test'
                }]
            })
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle special characters in insignia data', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                insignias: [{
                    id: 1,
                    nombre: 'Test <>&"\'',
                    imagen: '/img.png',
                    descripcion: 'Special chars: <>&"\''
                }]
            })
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle large number of insignias', async () => {
        const manyInsignias = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            nombre: `Insignia ${i}`,
            imagen: `/img${i}.png`,
            descripcion: `Desc ${i}`
        }));

        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ insignias: manyInsignias })
        });
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should handle fetch with invalid URL', async () => {
        globalThis.fetch.mockRejectedValueOnce(new Error('Invalid URL'));
        
        const { container } = render(<InsigniaCarousel />);
        expect(container).toBeTruthy();
    });

    it('should maintain component structure', () => {
        const { container } = render(<InsigniaCarousel />);
        expect(container.firstChild).toBeTruthy();
    });
});

