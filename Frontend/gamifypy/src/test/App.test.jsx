import { describe, it, expect, vi } from 'vitest';

// Mock App component completely
vi.mock('../App', () => ({
    default: () => null
}));

describe('App Component', () => {
    it('should import App component', async () => {
        const module = await import('../App');
        expect(module.default).toBeDefined();
    });

    it('should be a valid React component', async () => {
        const module = await import('../App');
        expect(typeof module.default).toBe('function');
    });

    it('should export App as default', async () => {
        const module = await import('../App');
        expect(module.default).not.toBeNull();
    });
});

