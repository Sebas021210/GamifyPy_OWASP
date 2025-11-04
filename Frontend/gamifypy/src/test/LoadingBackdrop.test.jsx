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
});
