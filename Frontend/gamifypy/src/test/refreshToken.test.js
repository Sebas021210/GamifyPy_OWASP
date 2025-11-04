import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refreshAccessToken } from '../services/refreshToken';

// Mock logger
vi.mock('../utils/logger', () => ({
    default: {
        error: vi.fn()
    }
}));

// Mock fetch
globalThis.fetch = vi.fn();

describe('refreshAccessToken Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        globalThis.fetch.mockReset();
    });

    it('should return null if no refresh token in localStorage', async () => {
        const result = await refreshAccessToken();
        expect(result).toBeNull();
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('should fetch with correct parameters', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access_token: 'new-access-token' })
        });

        await refreshAccessToken();

        expect(globalThis.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/auth/refresh',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: 'test-refresh-token' })
            })
        );
    });

    it('should store new access token in localStorage', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access_token: 'new-access-token' })
        });

        const result = await refreshAccessToken();

        expect(localStorage.getItem('token')).toBe('new-access-token');
        expect(result).toBe('new-access-token');
    });

    it('should return new access token', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access_token: 'new-token-123' })
        });

        const result = await refreshAccessToken();
        expect(result).toBe('new-token-123');
    });

    it('should return null on fetch error', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        const result = await refreshAccessToken();
        expect(result).toBeNull();
    });

    it('should handle network errors', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await refreshAccessToken();
        expect(result).toBeNull();
    });

    it('should handle empty refresh token', async () => {
        localStorage.setItem('refresh_token', '');

        const result = await refreshAccessToken();
        expect(result).toBeNull();
    });

    it('should handle malformed JSON response', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => { throw new Error('Invalid JSON'); }
        });

        const result = await refreshAccessToken();
        expect(result).toBeNull();
    });

    it('should handle 500 server error', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        const result = await refreshAccessToken();
        expect(result).toBeNull();
    });

    it('should handle 403 forbidden', async () => {
        localStorage.setItem('refresh_token', 'test-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            status: 403
        });

        const result = await refreshAccessToken();
        expect(result).toBeNull();
    });

    it('should make POST request', async () => {
        localStorage.setItem('refresh_token', 'test-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access_token: 'token' })
        });

        await refreshAccessToken();

        const callArgs = globalThis.fetch.mock.calls[0];
        expect(callArgs[1].method).toBe('POST');
    });

    it('should include Content-Type header', async () => {
        localStorage.setItem('refresh_token', 'test-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access_token: 'token' })
        });

        await refreshAccessToken();

        const callArgs = globalThis.fetch.mock.calls[0];
        expect(callArgs[1].headers['Content-Type']).toBe('application/json');
    });

    it('should send refresh_token in body', async () => {
        localStorage.setItem('refresh_token', 'my-refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access_token: 'token' })
        });

        await refreshAccessToken();

        const callArgs = globalThis.fetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        expect(body.refresh_token).toBe('my-refresh-token');
    });

    it('should handle timeout', async () => {
        localStorage.setItem('refresh_token', 'test-token');
        
        globalThis.fetch.mockRejectedValueOnce(new Error('Timeout'));

        const result = await refreshAccessToken();
        expect(result).toBeNull();
    });

    it('should update existing token', async () => {
        localStorage.setItem('token', 'old-token');
        localStorage.setItem('refresh_token', 'refresh-token');
        
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access_token: 'updated-token' })
        });

        await refreshAccessToken();

        expect(localStorage.getItem('token')).toBe('updated-token');
    });
});
