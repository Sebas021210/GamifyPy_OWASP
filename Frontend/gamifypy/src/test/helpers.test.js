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

describe('String Utilities', () => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const truncate = (str, length) => str.length > length ? str.slice(0, length) + '...' : str;
    const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-');

    it('should capitalize strings', () => {
        expect(capitalize('hello')).toBe('Hello');
        expect(capitalize('WORLD')).toBe('World');
        expect(capitalize('tEsT')).toBe('Test');
    });

    it('should truncate long strings', () => {
        expect(truncate('Hello World', 5)).toBe('Hello...');
        expect(truncate('Short', 10)).toBe('Short');
        expect(truncate('Test String', 4)).toBe('Test...');
    });

    it('should create slugs', () => {
        expect(slugify('Hello World')).toBe('hello-world');
        expect(slugify('Test String')).toBe('test-string');
        expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });

    it('should handle empty strings', () => {
        expect(capitalize('')).toBe('');
        expect(truncate('', 5)).toBe('');
        expect(slugify('')).toBe('');
    });

    it('should handle single character', () => {
        expect(capitalize('a')).toBe('A');
        expect(truncate('a', 1)).toBe('a');
        expect(slugify('a')).toBe('a');
    });
});

describe('Number Utilities', () => {
    const isEven = (n) => n % 2 === 0;
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const percentage = (value, total) => total === 0 ? 0 : (value / total) * 100;

    it('should check even numbers', () => {
        expect(isEven(2)).toBe(true);
        expect(isEven(4)).toBe(true);
        expect(isEven(1)).toBe(false);
        expect(isEven(3)).toBe(false);
        expect(isEven(0)).toBe(true);
    });

    it('should clamp numbers', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(15, 0, 10)).toBe(10);
        expect(clamp(7, 5, 8)).toBe(7);
    });

    it('should calculate percentages', () => {
        expect(percentage(50, 100)).toBe(50);
        expect(percentage(25, 100)).toBe(25);
        expect(percentage(75, 100)).toBe(75);
        expect(percentage(10, 0)).toBe(0);
    });

    it('should handle zero values', () => {
        expect(isEven(0)).toBe(true);
        expect(clamp(0, -10, 10)).toBe(0);
        expect(percentage(0, 100)).toBe(0);
    });

    it('should handle negative numbers', () => {
        expect(isEven(-2)).toBe(true);
        expect(clamp(-5, -10, -1)).toBe(-5);
        expect(percentage(-10, 100)).toBe(-10);
    });
});

describe('Array Utilities', () => {
    const unique = (arr) => [...new Set(arr)];
    const chunk = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };
    const flatten = (arr) => arr.reduce((acc, val) => acc.concat(val), []);

    it('should get unique values', () => {
        expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
        expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
        expect(unique([1, 1, 1])).toEqual([1]);
    });

    it('should chunk arrays', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
        expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
        expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('should flatten arrays', () => {
        expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
        expect(flatten([[1], [2], [3]])).toEqual([1, 2, 3]);
        expect(flatten([['a', 'b'], ['c']])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty arrays', () => {
        expect(unique([])).toEqual([]);
        expect(chunk([], 2)).toEqual([]);
        expect(flatten([])).toEqual([]);
    });

    it('should handle single element', () => {
        expect(unique([1])).toEqual([1]);
        expect(chunk([1], 2)).toEqual([[1]]);
        expect(flatten([[1]])).toEqual([1]);
    });
});

describe('Object Utilities', () => {
    const pick = (obj, keys) => {
        const result = {};
        keys.forEach(key => {
            if (key in obj) result[key] = obj[key];
        });
        return result;
    };

    const omit = (obj, keys) => {
        const result = { ...obj };
        keys.forEach(key => delete result[key]);
        return result;
    };

    it('should pick properties', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(pick(obj, ['a', 'b'])).toEqual({ a: 1, b: 2 });
        expect(pick(obj, ['c'])).toEqual({ c: 3 });
        expect(pick(obj, [])).toEqual({});
    });

    it('should omit properties', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(omit(obj, ['a'])).toEqual({ b: 2, c: 3 });
        expect(omit(obj, ['b', 'c'])).toEqual({ a: 1 });
        expect(omit(obj, [])).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle missing keys', () => {
        const obj = { a: 1, b: 2 };
        expect(pick(obj, ['a', 'x'])).toEqual({ a: 1 });
        expect(omit(obj, ['x', 'y'])).toEqual({ a: 1, b: 2 });
    });

    it('should handle empty objects', () => {
        expect(pick({}, ['a'])).toEqual({});
        expect(omit({}, ['a'])).toEqual({});
    });
});

describe('Date Utilities', () => {
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    it('should format dates', () => {
        const date = new Date('2024-01-15');
        expect(formatDate(date)).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('should check if date is today', () => {
        const today = new Date();
        expect(isToday(today)).toBe(true);
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(isToday(yesterday)).toBe(false);
    });

    it('should handle different months', () => {
        const date1 = new Date('2024-01-15');
        const date2 = new Date('2024-12-25');
        expect(formatDate(date1)).toContain('01');
        expect(formatDate(date2)).toContain('12');
    });
});
