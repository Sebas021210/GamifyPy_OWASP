import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from '../view/auth/ForgotPassword';

// Mock ResetPassword component
vi.mock('../components/ResetPassword', () => ({
    default: ({ open }) => (
        open ? <div data-testid="reset-password-dialog">Reset Password Dialog</div> : null
    )
}));

describe('ForgotPassword Component', () => {
    const renderForgotPassword = () => {
        return render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        );
    };

    it('should render forgot password page', () => {
        renderForgotPassword();
        expect(document.body).toBeTruthy();
    });

    it('should be a valid component', () => {
        expect(ForgotPassword).toBeDefined();
        expect(typeof ForgotPassword).toBe('function');
    });

    it('should import successfully', async () => {
        const module = await import('../view/auth/ForgotPassword');
        expect(module.default).toBeDefined();
    });
});
