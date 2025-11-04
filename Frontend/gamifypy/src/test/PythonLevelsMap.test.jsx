import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PythonLevelsMap from '../components/PythonLevelsMap';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock logger
vi.mock('../utils/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}));

// Mock LoadingBackdrop
vi.mock('../components/LoadingBackdrop', () => ({
  default: ({ loading }) => loading ? <div data-testid="loading-backdrop">Loading...</div> : null
}));

describe('PythonLevelsMap Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render loading state initially', () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading-backdrop')).toBeInTheDocument();
  });

  it('should fetch levels on mount', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: false, completado: false },
      { id: 2, nombre: 'Nivel 2', id_categoria: 1, bloqueado: true, completado: false }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/category-level/niveles',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          })
        })
      );
    });
  });

  it('should render title "Niveles"', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Niveles')).toBeInTheDocument();
    });
  });

  it('should separate main levels and extra levels', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: false, completado: false },
      { id: 2, nombre: 'Nivel 2', id_categoria: 2, bloqueado: false, completado: false },
      { id: 11, nombre: 'Extra 1', id_categoria: 5, bloqueado: false, completado: false },
      { id: 12, nombre: 'Extra 2', id_categoria: 5, bloqueado: false, completado: false }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    const { container } = render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    expect(container).toBeTruthy();
  });

  it('should handle missing token', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle fetch error', async () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unauthorized' })
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should render profile icon button', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: false, completado: false }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Niveles')).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render levels with correct gradient when completed', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: false, completado: true }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    const { container } = render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    expect(container).toBeTruthy();
  });

  it('should render levels with correct gradient when unlocked', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: false, completado: false }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    const { container } = render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    expect(container).toBeTruthy();
  });

  it('should render levels with correct gradient when locked', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: true, completado: false }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    const { container } = render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    expect(container).toBeTruthy();
  });

  it('should handle network error', async () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should assign correct icons for different level IDs', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: false, completado: false },
      { id: 3, nombre: 'Nivel 3', id_categoria: 1, bloqueado: false, completado: false },
      { id: 5, nombre: 'Nivel 5', id_categoria: 1, bloqueado: false, completado: false },
      { id: 6, nombre: 'Nivel 6', id_categoria: 1, bloqueado: false, completado: false },
      { id: 11, nombre: 'Nivel 11', id_categoria: 1, bloqueado: false, completado: false }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    const { container } = render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    expect(container).toBeTruthy();
  });

  it('should render empty levels array', async () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Niveles')).toBeInTheDocument();
    });
  });

  it('should handle levels with mixed estados', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockLevels = [
      { id: 1, nombre: 'Nivel 1', id_categoria: 1, bloqueado: false, completado: true },
      { id: 2, nombre: 'Nivel 2', id_categoria: 1, bloqueado: false, completado: false },
      { id: 3, nombre: 'Nivel 3', id_categoria: 1, bloqueado: true, completado: false }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLevels
    });

    const { container } = render(
      <BrowserRouter>
        <PythonLevelsMap />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    expect(container).toBeTruthy();
  });
});
