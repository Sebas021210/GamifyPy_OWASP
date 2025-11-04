import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../services/ProtectedRoute';

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should redirect to /auth when no token exists', () => {
    const TestComponent = () => <div>Protected Content</div>;
    
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          } />
          <Route path="/auth" element={<div>Auth Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when token exists', () => {
    localStorage.setItem('token', 'fake-token-123');
    const TestComponent = () => <div>Protected Content</div>;
    
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should check localStorage for token', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('token', 'test-token');

    const TestComponent = () => <div>Test</div>;
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(getItemSpy).toHaveBeenCalledWith('token');
    getItemSpy.mockRestore();
  });
});
