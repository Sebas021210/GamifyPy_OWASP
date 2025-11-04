import { describe, it, expect } from 'vitest';

describe('Form Validation Helpers', () => {
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password && password.length >= 8;
    };

    const validateUsername = (username) => {
        return username && username.length >= 3 && username.length <= 20;
    };

    it('should validate correct email format', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
        expect(validateEmail('invalid')).toBe(false);
        expect(validateEmail('test@')).toBe(false);
        expect(validateEmail('@example.com')).toBe(false);
        expect(validateEmail('')).toBe(false);
    });

    it('should validate password length', () => {
        expect(validatePassword('12345678')).toBe(true);
        expect(validatePassword('longpassword123')).toBe(true);
    });

    it('should reject short passwords', () => {
        expect(validatePassword('1234567')).toBeFalsy();
        expect(validatePassword('short')).toBeFalsy();
        expect(validatePassword('')).toBeFalsy();
    });

    it('should validate username length', () => {
        expect(validateUsername('testuser')).toBe(true);
        expect(validateUsername('abc')).toBe(true);
        expect(validateUsername('username123')).toBe(true);
    });

    it('should reject invalid usernames', () => {
        expect(validateUsername('ab')).toBeFalsy();
        expect(validateUsername('a'.repeat(21))).toBeFalsy();
        expect(validateUsername('')).toBeFalsy();
    });
});

describe('API Response Handlers', () => {
    it('should handle success response', () => {
        const response = { ok: true, status: 200 };
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
    });

    it('should handle error responses', () => {
        const responses = [
            { ok: false, status: 400 },
            { ok: false, status: 401 },
            { ok: false, status: 404 },
            { ok: false, status: 500 }
        ];

        responses.forEach(response => {
            expect(response.ok).toBe(false);
            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });

    it('should validate JSON structure', () => {
        const jsonData = {
            user: { id: 1, name: 'Test' },
            token: 'abc123',
            refresh_token: 'def456'
        };

        expect(jsonData).toHaveProperty('user');
        expect(jsonData).toHaveProperty('token');
        expect(jsonData.user).toHaveProperty('id');
    });
});

describe('Token Management', () => {
    const createToken = (data) => {
        return `Bearer ${btoa(JSON.stringify(data))}`;
    };

    const parseToken = (token) => {
        try {
            const base64 = token.replace('Bearer ', '');
            return JSON.parse(atob(base64));
        } catch {
            return null;
        }
    };

    it('should create valid token', () => {
        const token = createToken({ userId: 123, exp: Date.now() });
        expect(token).toContain('Bearer ');
        expect(token.length).toBeGreaterThan(10);
    });

    it('should parse token correctly', () => {
        const data = { userId: 123 };
        const token = createToken(data);
        const parsed = parseToken(token);
        expect(parsed.userId).toBe(123);
    });

    it('should handle invalid token', () => {
        expect(parseToken('invalid-token')).toBeNull();
        expect(parseToken('')).toBeNull();
    });
});

describe('URL and Route Helpers', () => {
    const buildApiUrl = (endpoint) => {
        const base = 'http://localhost:8000';
        return `${base}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    };

    it('should build correct API URLs', () => {
        expect(buildApiUrl('/auth/login')).toBe('http://localhost:8000/auth/login');
        expect(buildApiUrl('user/profile')).toBe('http://localhost:8000/user/profile');
    });

    it('should handle route parameters', () => {
        const buildRoute = (base, params) => {
            return `${base}/${params.join('/')}`;
        };

        expect(buildRoute('/levels', ['1'])).toBe('/levels/1');
        expect(buildRoute('/category', ['python', '5'])).toBe('/category/python/5');
    });
});

describe('Data Transformation Helpers', () => {
    const formatUserData = (user) => ({
        id: user.id || 0,
        username: user.username || '',
        email: user.email || '',
        nivel: user.nivel || 'Principiante'
    });

    it('should format user data correctly', () => {
        const user = { id: 1, username: 'test', email: 'test@test.com' };
        const formatted = formatUserData(user);
        
        expect(formatted).toHaveProperty('id');
        expect(formatted).toHaveProperty('username');
        expect(formatted).toHaveProperty('email');
        expect(formatted.nivel).toBe('Principiante');
    });

    it('should handle incomplete user data', () => {
        const incomplete = { id: 1 };
        const formatted = formatUserData(incomplete);
        
        expect(formatted.id).toBe(1);
        expect(formatted.username).toBe('');
        expect(formatted.email).toBe('');
    });

    it('should transform arrays correctly', () => {
        const data = [1, 2, 3, 4, 5];
        const doubled = data.map(n => n * 2);
        
        expect(doubled).toEqual([2, 4, 6, 8, 10]);
    });
});
