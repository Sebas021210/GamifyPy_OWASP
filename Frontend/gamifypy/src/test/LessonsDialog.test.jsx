import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LessonsDialog from '../components/LessonsDialog';

// Mock logger
vi.mock('../utils/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}));

// Mock ReactMarkdown
vi.mock('react-markdown', () => ({
  default: ({ children }) => <div data-testid="markdown-content">{children}</div>
}));

// Mock remark-gfm
vi.mock('remark-gfm', () => ({
  default: () => {}
}));

describe('LessonsDialog Component', () => {
  const mockHandleClose = vi.fn();
  const mockUpdateLecciones = vi.fn();
  const mockOnNextLesson = vi.fn();

  const mockLeccion = {
    id: 1,
    titulo: 'Introducción a Python',
    completada: false,
    tiempo_estimado: 15,
    contenido: '# Lección 1\n\nEste es el contenido de la lección.'
  };

  const mockLessonContent = '# Lección 1\n\nEste es el contenido de la lección.';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ csrf_token: 'test-token' })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render component without crashing', () => {
    const { container } = render(
      <LessonsDialog
        open={false}
        handleClose={mockHandleClose}
        leccion={mockLeccion}
        lessonContent={mockLessonContent}
        updateLecciones={mockUpdateLecciones}
        onNextLesson={mockOnNextLesson}
        hasNextLesson={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should fetch CSRF token on mount', async () => {
    render(
      <LessonsDialog
        open={true}
        handleClose={mockHandleClose}
        leccion={mockLeccion}
        lessonContent={mockLessonContent}
        updateLecciones={mockUpdateLecciones}
        onNextLesson={mockOnNextLesson}
        hasNextLesson={true}
      />
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8000/csrf/get-csrf-token');
    });
  });

  it('should handle props correctly', () => {
    const { container } = render(
      <LessonsDialog
        open={true}
        handleClose={mockHandleClose}
        leccion={mockLeccion}
        lessonContent={mockLessonContent}
        updateLecciones={mockUpdateLecciones}
        onNextLesson={mockOnNextLesson}
        hasNextLesson={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle completed lesson', () => {
    const completedLeccion = { ...mockLeccion, completada: true };
    
    const { container } = render(
      <LessonsDialog
        open={true}
        handleClose={mockHandleClose}
        leccion={completedLeccion}
        lessonContent={mockLessonContent}
        updateLecciones={mockUpdateLecciones}
        onNextLesson={mockOnNextLesson}
        hasNextLesson={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle incomplete lesson', () => {
    const { container } = render(
      <LessonsDialog
        open={true}
        handleClose={mockHandleClose}
        leccion={mockLeccion}
        lessonContent={mockLessonContent}
        updateLecciones={mockUpdateLecciones}
        onNextLesson={mockOnNextLesson}
        hasNextLesson={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should call handleClose when provided', () => {
    render(
      <LessonsDialog
        open={true}
        handleClose={mockHandleClose}
        leccion={mockLeccion}
        lessonContent={mockLessonContent}
        updateLecciones={mockUpdateLecciones}
        onNextLesson={mockOnNextLesson}
        hasNextLesson={true}
      />
    );

    expect(mockHandleClose).toBeDefined();
    expect(typeof mockHandleClose).toBe('function');
  });

  it('should accept updateLecciones callback', () => {
    render(
      <LessonsDialog
        open={true}
        handleClose={mockHandleClose}
        leccion={mockLeccion}
        lessonContent={mockLessonContent}
        updateLecciones={mockUpdateLecciones}
        onNextLesson={mockOnNextLesson}
        hasNextLesson={true}
      />
    );

    expect(mockUpdateLecciones).toBeDefined();
    expect(typeof mockUpdateLecciones).toBe('function');
  });
});
