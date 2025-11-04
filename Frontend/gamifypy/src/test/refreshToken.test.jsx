import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { refreshAccessToken } from '../services/refreshToken';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('refreshToken Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null when no refresh token exists', async () => {
    const result = await refreshAccessToken();
    expect(result).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should call refresh endpoint with correct token', async () => {
    const mockRefreshToken = 'test-refresh-token';
    const mockAccessToken = 'new-access-token';
    
    localStorage.setItem('refresh_token', mockRefreshToken);
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: mockAccessToken })
    });

    const result = await refreshAccessToken();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: mockRefreshToken })
      })
    );
    expect(result).toBe(mockAccessToken);
    expect(localStorage.getItem('token')).toBe(mockAccessToken);
  });

  it('should handle fetch errors gracefully', async () => {
    localStorage.setItem('refresh_token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await refreshAccessToken();

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle network errors', async () => {
    localStorage.setItem('refresh_token', 'test-token');
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await refreshAccessToken();

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should store new access token in localStorage on success', async () => {
    const newToken = 'updated-access-token';
    localStorage.setItem('refresh_token', 'refresh-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: newToken })
    });

    await refreshAccessToken();
    expect(localStorage.getItem('token')).toBe(newToken);
  });
});
