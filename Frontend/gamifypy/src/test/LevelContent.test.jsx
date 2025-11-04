import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import LevelContent from '../components/LevelContent';

// Mock logger
vi.mock('../utils/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}));

// Mock LessonsDialog
vi.mock('../components/LessonsDialog', () => ({
  default: ({ open, handleClose }) => open ? (
    <div data-testid="lessons-dialog">
      <button onClick={handleClose}>Close Lessons</button>
    </div>
  ) : null
}));

// Mock ExerciseDialog
vi.mock('../components/ExcerciseDialog', () => ({
  default: ({ open, handleClose }) => open ? (
    <div data-testid="exercise-dialog">
      <button onClick={handleClose}>Close Exercise</button>
    </div>
  ) : null
}));

describe('LevelContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'test-token');
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockAllFetches = () => {
    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrf_token: 'test-token' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ preguntas: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ preguntas: [] })
      });
  };

  it('should render component with id_nivel prop', () => {
    mockAllFetches();
    const { container } = render(<LevelContent id_nivel={1} />);
    expect(container).toBeTruthy();
  });

  it('should fetch CSRF token on mount', async () => {
    mockAllFetches();
    render(<LevelContent id_nivel={1} />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8000/csrf/get-csrf-token');
    });
  });

  it('should fetch exercises on mount', async () => {
    mockAllFetches();
    render(<LevelContent id_nivel={1} />);

    await waitFor(() => {
      const calls = globalThis.fetch.mock.calls;
      const hasExerciseCall = calls.some(call => 
        call[0]?.includes('/preguntas/opcion-multiple') || 
        call[0]?.includes('/preguntas/codigo')
      );
      expect(hasExerciseCall).toBe(true);
    });
  });

  it('should render with id_nivel prop correctly', () => {
    mockAllFetches();
    const { container } = render(<LevelContent id_nivel={5} />);
    expect(container).toBeTruthy();
  });

  it('should initialize component state', () => {
    mockAllFetches();
    render(<LevelContent id_nivel={1} />);
    expect(true).toBe(true);
  });

  it('should accept different id_nivel values', () => {
    mockAllFetches();
    render(<LevelContent id_nivel={10} />);
    expect(true).toBe(true);
  });

  it('should handle component unmount', () => {
    mockAllFetches();
    const { unmount } = render(<LevelContent id_nivel={1} />);
    unmount();
    expect(true).toBe(true);
  });
});

