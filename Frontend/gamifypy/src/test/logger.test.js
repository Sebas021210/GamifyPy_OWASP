import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import logger from '../utils/logger';

describe('Logger Utility', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'info').mockImplementation(() => {});
        vi.spyOn(console, 'debug').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have log method', () => {
        expect(logger.log).toBeDefined();
        expect(typeof logger.log).toBe('function');
    });

    it('should have error method', () => {
        expect(logger.error).toBeDefined();
        expect(typeof logger.error).toBe('function');
    });

    it('should have warn method', () => {
        expect(logger.warn).toBeDefined();
        expect(typeof logger.warn).toBe('function');
    });

    it('should have info method', () => {
        expect(logger.info).toBeDefined();
        expect(typeof logger.info).toBe('function');
    });

    it('should have debug method', () => {
        expect(logger.debug).toBeDefined();
        expect(typeof logger.debug).toBe('function');
    });

    it('should call console.error for error method', () => {
        const testMessage = 'Test error message';
        logger.error(testMessage);
        expect(consoleErrorSpy).toHaveBeenCalledWith(testMessage);
    });

    it('should handle multiple arguments in error', () => {
        logger.error('Error:', 'details', 123);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'details', 123);
    });

    it('should export logger as default', () => {
        expect(logger).toBeDefined();
    });
});
