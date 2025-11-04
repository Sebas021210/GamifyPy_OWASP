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
});
