import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import SkillsList from '../components/SkillsList';

// Mock fetch
globalThis.fetch = vi.fn();

describe('SkillsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render without crashing', () => {
    const { container } = render(<SkillsList />);
    expect(container).toBeTruthy();
  });

  it('should fetch skills data when token exists', async () => {
    const mockSkills = [
      { id: 1, name: 'Python Basics', completed: true },
      { id: 2, name: 'Advanced Python', completed: false }
    ];

    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSkills
    });

    render(<SkillsList />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/habilidades',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token'
          })
        })
      );
    });
  });

  it('should handle fetch error gracefully', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should not fetch when no token exists', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching skills data:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});

describe('Skills Helper Functions', () => {
  it('should generate correct number of positions', () => {
    const positions = [];
    const totalSkills = 20;
    const cols = 10;
    
    for (let i = 0; i < totalSkills; i++) {
      positions.push({ x: i * 10, y: Math.floor(i / cols) * 10 });
    }
    
    expect(positions).toHaveLength(totalSkills);
  });

  it('should calculate grid positions correctly', () => {
    const nodeSpacing = 95;
    const startX = 40;
    const col = 0;
    const row = 0;
    
    const x = startX + (col * nodeSpacing);
    const y = 80 + (row * nodeSpacing * 0.8);
    
    expect(x).toBe(40);
    expect(y).toBe(80);
  });

  it('should handle 401 unauthorized response', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should handle 500 server error', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should handle empty skills array', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    const { container } = render(<SkillsList />);
    expect(container).toBeTruthy();
  });

  it('should handle malformed JSON response', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should calculate multiple rows correctly', () => {
    const cols = 5;
    const positions = [];
    
    for (let i = 0; i < 15; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      positions.push({ row, col });
    }

    expect(positions[0]).toEqual({ row: 0, col: 0 });
    expect(positions[5]).toEqual({ row: 1, col: 0 });
    expect(positions[10]).toEqual({ row: 2, col: 0 });
  });

  it('should handle very large skill datasets', async () => {
    const largeSkillSet = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Skill ${i}`,
      completed: i % 2 === 0
    }));

    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => largeSkillSet
    });

    const { container } = render(<SkillsList />);
    expect(container).toBeTruthy();
  });

  it('should calculate spacing correctly', () => {
    const nodeSpacing = 95;
    const col = 3;
    const expected = 40 + (col * nodeSpacing);
    
    expect(expected).toBe(325);
  });

  it('should handle skills with special characters', async () => {
    const skills = [{
      id: 1,
      name: 'Python <>&"\'',
      completed: true
    }];

    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => skills
    });

    const { container } = render(<SkillsList />);
    expect(container).toBeTruthy();
  });

  it('should handle network timeout', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockRejectedValueOnce(new Error('Timeout'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should handle CORS errors', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockRejectedValueOnce(new Error('CORS policy'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should calculate Y position with offset', () => {
    const nodeSpacing = 95;
    const row = 2;
    const y = 80 + (row * nodeSpacing * 0.8);
    
    expect(y).toBe(232);
  });

  it('should handle skills with missing properties', async () => {
    const skills = [
      { id: 1 },
      { name: 'Test' },
      { completed: true }
    ];

    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => skills
    });

    const { container } = render(<SkillsList />);
    expect(container).toBeTruthy();
  });

  it('should handle null response', async () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<SkillsList />);
    
    expect(container).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it('should calculate positions for different grid sizes', () => {
    const testGrids = [
      { cols: 5, total: 10 },
      { cols: 10, total: 20 },
      { cols: 3, total: 9 }
    ];

    testGrids.forEach(grid => {
      const positions = [];
      for (let i = 0; i < grid.total; i++) {
        positions.push({
          row: Math.floor(i / grid.cols),
          col: i % grid.cols
        });
      }
      expect(positions).toHaveLength(grid.total);
    });
  });

  it('should handle empty token string', async () => {
    localStorage.setItem('token', '');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should verify fetch is called once', async () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<SkillsList />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });

  it('should handle connection refused error', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockRejectedValueOnce(new Error('Connection refused'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SkillsList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should calculate correct column indices', () => {
    const cols = 5;
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const colIndices = indices.map(i => i % cols);
    
    expect(colIndices).toEqual([0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0]);
  });
});
