import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../view/profile/profile';

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

// Mock components
vi.mock('../components/InsigniaCarousel', () => ({
  default: () => <div data-testid="insignias-carousel">Insignias Mock</div>
}));

vi.mock('../components/SkillsList', () => ({
  default: () => <div data-testid="skills-list">Skills Mock</div>
}));

vi.mock('../components/LoadingBackdrop', () => ({
  default: ({ loading }) => loading ? <div data-testid="loading-backdrop">Loading...</div> : null
}));

describe('Profile Component', () => {
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
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading-backdrop')).toBeInTheDocument();
  });

  it('should fetch user data on mount', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/me',
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

  it('should render user name after successful fetch', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'John Doe',
      email: 'john@example.com'
    };

    const mockProgresoData = {
      Categoria: 'Principiante',
      Nivel: 'Level:1',
      Puntos: 100
    };

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgresoData
      });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should fetch progreso data after user data is loaded', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    const mockProgresoData = {
      Categoria: 'Intermedio',
      Nivel: 'Level:5',
      Puntos: 500
    };

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgresoData
      });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/progreso',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          })
        })
      );
    });
  });

  it('should display progreso data correctly', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    const mockProgresoData = {
      Categoria: 'Avanzado',
      Nivel: 'Level:10',
      Puntos: 1000
    };

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgresoData
      });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Categoria: Avanzado')).toBeInTheDocument();
      expect(screen.getByText('Nivel actual: Level - 10')).toBeInTheDocument();
      expect(screen.getByText('Puntos de experiencia (XP): 1000')).toBeInTheDocument();
    });
  });

  it('should handle missing token error', async () => {
    // No token in localStorage
    
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });
  });

  it('should handle user fetch error', async () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unauthorized' })
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle progreso fetch error', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Not found' })
      });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Loading progreso data/)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should navigate to levels page when back button is clicked', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const backButton = screen.getAllByRole('button')[0];
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/levels');
  });

  it('should handle logout correctly', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('refresh_token', 'test-refresh-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const logoutButton = screen.getAllByRole('button')[1];
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should render Insignias component', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('insignias-carousel')).toBeInTheDocument();
    });
  });

  it('should render Skills component', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('skills-list')).toBeInTheDocument();
    });
  });

  it('should show loading text before progreso data loads', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('Loading progreso data...')).toBeInTheDocument();
  });

  it('should handle network error on user fetch', async () => {
    localStorage.setItem('token', 'test-token');
    
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle network error on progreso fetch', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should render section headers', async () => {
    localStorage.setItem('token', 'test-token');
    
    const mockUserData = {
      nombre: 'Test User',
      email: 'test@example.com'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Insignias')).toBeInTheDocument();
      expect(screen.getByText('Habilidades')).toBeInTheDocument();
    });
  });
});
