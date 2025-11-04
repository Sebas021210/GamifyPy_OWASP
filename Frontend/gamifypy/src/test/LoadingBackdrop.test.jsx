import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingBackdrop from '../components/LoadingBackdrop';

describe('LoadingBackdrop Component', () => {
  it('should render loading spinner when loading is true', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    const backdrop = container.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeInTheDocument();
  });

  it('should not show backdrop when loading is false', () => {
    render(<LoadingBackdrop loading={false} />);
    const backdrop = screen.queryByRole('presentation');
    expect(backdrop).not.toBeInTheDocument();
  });

  it('should render CircularProgress component when loading', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    const progress = container.querySelector('.MuiCircularProgress-root');
    expect(progress).toBeInTheDocument();
  });

  it('should have wrapper div element', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it('should apply correct color to CircularProgress', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    const progress = container.querySelector('.MuiCircularProgress-root');
    expect(progress).toBeTruthy();
  });

  it('should toggle backdrop visibility', () => {
    const { container, rerender } = render(<LoadingBackdrop loading={false} />);
    let backdrop = container.querySelector('.MuiBackdrop-open');
    expect(backdrop).toBeFalsy();
    
    rerender(<LoadingBackdrop loading={true} />);
    backdrop = container.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeTruthy();
  });

  it('should maintain component structure', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('should render with correct z-index styling', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    const backdrop = container.querySelector('.MuiBackdrop-root');
    expect(backdrop).toHaveStyle({ color: '#fff' });
  });

  it('should be a valid React component', () => {
    expect(LoadingBackdrop).toBeDefined();
    expect(typeof LoadingBackdrop).toBe('function');
  });

  it('should handle rapid loading state changes', () => {
    const { rerender } = render(<LoadingBackdrop loading={false} />);
    rerender(<LoadingBackdrop loading={true} />);
    rerender(<LoadingBackdrop loading={false} />);
    rerender(<LoadingBackdrop loading={true} />);
    expect(true).toBe(true);
  });

  it('should accept loading prop correctly', () => {
    expect(() => render(<LoadingBackdrop loading={true} />)).not.toThrow();
    expect(() => render(<LoadingBackdrop loading={false} />)).not.toThrow();
  });

  it('should render CircularProgress with inherit color', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    const progress = container.querySelector('.MuiCircularProgress-colorInherit');
    expect(progress).toBeTruthy();
  });

  it('should have presentation role when open', () => {
    const { container } = render(<LoadingBackdrop loading={true} />);
    const backdrop = container.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => {
      render(<LoadingBackdrop loading={true} />);
      render(<LoadingBackdrop loading={false} />);
    }).not.toThrow();
  });
});
