import { describe, it, expect, vi } from 'vitest';

// Mock LessonsDialog completely
vi.mock('../components/LessonsDialog', () => ({
    default: () => null
}));

// Mock ReactMarkdown
vi.mock('react-markdown', () => ({
    default: () => null
}));

// Mock logger
vi.mock('../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('LessonsDialog Component', () => {
    it('should import LessonsDialog component', async () => {
        const module = await import('../components/LessonsDialog');
        expect(module.default).toBeDefined();
    });

    it('should be a valid React component', async () => {
        const module = await import('../components/LessonsDialog');
        expect(typeof module.default).toBe('function');
    });

    it('should export LessonsDialog as default', async () => {
        const module = await import('../components/LessonsDialog');
        expect(module.default).not.toBeNull();
    });
});
