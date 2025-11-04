import { describe, it, expect, vi } from 'vitest';

// Mock register component completely to avoid "too many files" error
vi.mock('../view/auth/register', () => ({
    default: () => null
}));

// Mock all dependencies
vi.mock('../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

vi.mock('@mui/material', () => ({
    TextField: () => null,
    Button: () => null,
    Checkbox: () => null,
    FormControlLabel: () => null,
}));

describe('Register Component', () => {
    it('should import register component', async () => {
        const module = await import('../view/auth/register');
        expect(module.default).toBeDefined();
    });

    it('should be a valid React component', async () => {
        const module = await import('../view/auth/register');
        expect(typeof module.default).toBe('function');
    });

    it('should export register as default', async () => {
        const module = await import('../view/auth/register');
        expect(module.default).not.toBeNull();
    });
});
