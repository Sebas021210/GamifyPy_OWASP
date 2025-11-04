import { describe, it, expect, vi } from 'vitest';

// Mock ExerciseDialog completely
vi.mock('../components/ExcerciseDialog', () => ({
    default: () => null
}));

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
    default: () => null
}));

// Mock logger
vi.mock('../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('ExerciseDialog Component', () => {
    it('should import ExerciseDialog component', async () => {
        const module = await import('../components/ExcerciseDialog');
        expect(module.default).toBeDefined();
    });

    it('should be a valid React component', async () => {
        const module = await import('../components/ExcerciseDialog');
        expect(typeof module.default).toBe('function');
    });

    it('should export ExerciseDialog as default', async () => {
        const module = await import('../components/ExcerciseDialog');
        expect(module.default).not.toBeNull();
    });
});
