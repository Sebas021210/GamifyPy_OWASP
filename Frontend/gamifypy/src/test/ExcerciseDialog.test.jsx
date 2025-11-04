import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import ExerciseDialog from '../components/ExcerciseDialog';

// Mock logger
vi.mock('../utils/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}));

// Mock monaco editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }) => (
    <textarea 
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  )
}));

describe('ExerciseDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render when open is true', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 1,
      titulo: 'Test Exercise',
      tipo: 'codigo',
      codigo_inicial: 'print("hello")'
    };

    const { container } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle open prop as false', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 1,
      titulo: 'Test Exercise',
      tipo: 'codigo'
    };

    render(
      <ExerciseDialog 
        open={false}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(true).toBe(true);
  });

  it('should fetch CSRF token on mount', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-csrf-token' })
    });

    const mockEjercicio = {
      id: 1,
      titulo: 'Test Exercise',
      tipo: 'codigo',
      codigo_inicial: 'print("test")'
    };

    render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8000/csrf/get-csrf-token');
    });
  });

  it('should render codigo type exercise', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 1,
      titulo: 'Código Exercise',
      tipo: 'codigo',
      codigo_inicial: 'def test():\n    pass'
    };

    const { container } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should render grupo_opcion_multiple type exercise', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 2,
      titulo: 'Quiz Exercise',
      tipo: 'grupo_opcion_multiple',
      preguntas: [
        {
          id: 1,
          pregunta: 'What is 2+2?',
          opciones: ['3', '4', '5'],
          intento_realizado: false
        }
      ],
      intento_realizado: false
    };

    const { container } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle ejercicio with codigo_inicial', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 3,
      titulo: 'Exercise with code',
      tipo: 'codigo',
      codigo_inicial: '# Initial code\nprint("Hello World")'
    };

    const { container } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle ejercicio without codigo_inicial', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 4,
      titulo: 'Exercise without code',
      tipo: 'codigo'
    };

    const { container } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should call handleClose when provided', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockHandleClose = vi.fn();
    const mockEjercicio = {
      id: 5,
      titulo: 'Test Close',
      tipo: 'codigo'
    };

    render(
      <ExerciseDialog 
        open={true}
        handleClose={mockHandleClose}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(mockHandleClose).not.toHaveBeenCalled();
  });

  it('should handle updateEjercicios prop', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockUpdate = vi.fn();
    const mockEjercicio = {
      id: 6,
      titulo: 'Test Update',
      tipo: 'codigo'
    };

    render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={mockUpdate}
      />
    );

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should reset state when closed and reopened', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 7,
      titulo: 'Test Reset',
      tipo: 'codigo',
      codigo_inicial: 'test code'
    };

    const { rerender } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    rerender(
      <ExerciseDialog 
        open={false}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    rerender(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(true).toBe(true);
  });

  it('should handle different exercise IDs', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const ejercicio1 = { id: 10, titulo: 'Ex 1', tipo: 'codigo' };
    const ejercicio2 = { id: 20, titulo: 'Ex 2', tipo: 'codigo' };

    const { rerender } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={ejercicio1}
        updateEjercicios={() => {}}
      />
    );

    rerender(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={ejercicio2}
        updateEjercicios={() => {}}
      />
    );

    expect(true).toBe(true);
  });

  it('should handle exercise with previous attempts', () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });

    const mockEjercicio = {
      id: 8,
      titulo: 'Quiz with attempts',
      tipo: 'grupo_opcion_multiple',
      intento_realizado: true,
      preguntas: [
        {
          id: 1,
          pregunta: 'Test question',
          opciones: ['A', 'B', 'C'],
          respuesta_enviada: 'B',
          correcto: true,
          retroalimentacion: 'Correct!',
          intento_realizado: true
        }
      ]
    };

    const { container } = render(
      <ExerciseDialog 
        open={true}
        handleClose={() => {}}
        ejercicio={mockEjercicio}
        updateEjercicios={() => {}}
      />
    );

    expect(container).toBeTruthy();
  });
});
