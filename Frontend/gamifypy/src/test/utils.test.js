import { describe, it, expect } from 'vitest';

// Utility functions tests
describe('Utility Functions', () => {
  describe('Token validation', () => {
    it('should validate token format', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';
      expect(validToken).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    it('should identify invalid token', () => {
      const invalidToken = 'invalid-token';
      expect(invalidToken).not.toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });
  });

  describe('LocalStorage helpers', () => {
    it('should store and retrieve data from localStorage', () => {
      const key = 'testKey';
      const value = 'testValue';
      localStorage.setItem(key, value);
      expect(localStorage.getItem(key)).toBe(value);
    });

    it('should return null for non-existent keys', () => {
      expect(localStorage.getItem('nonExistentKey')).toBeNull();
    });

    it('should remove item from localStorage', () => {
      localStorage.setItem('tempKey', 'tempValue');
      localStorage.removeItem('tempKey');
      expect(localStorage.getItem('tempKey')).toBeNull();
    });

    it('should clear all localStorage items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.clear();
      expect(localStorage.length).toBe(0);
    });
  });

  describe('URL validation', () => {
    it('should validate API endpoints', () => {
      const validEndpoint = 'http://localhost:8000/api/endpoint';
      expect(validEndpoint).toMatch(/^https?:\/\/.+/);
    });

    it('should detect invalid URLs', () => {
      const invalidUrl = 'not-a-url';
      expect(invalidUrl).not.toMatch(/^https?:\/\/.+/);
    });
  });

  describe('Data transformation', () => {
    it('should parse JSON strings', () => {
      const jsonString = '{"name":"test","value":123}';
      const parsed = JSON.parse(jsonString);
      expect(parsed).toEqual({ name: 'test', value: 123 });
    });

    it('should stringify objects', () => {
      const obj = { key: 'value', number: 42 };
      const stringified = JSON.stringify(obj);
      expect(stringified).toBe('{"key":"value","number":42}');
    });
  });

  describe('Array operations', () => {
    it('should filter array elements', () => {
      const numbers = [1, 2, 3, 4, 5];
      const filtered = numbers.filter(n => n > 3);
      expect(filtered).toEqual([4, 5]);
    });

    it('should map array elements', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });

    it('should find elements in array', () => {
      const items = ['apple', 'banana', 'orange'];
      const found = items.find(item => item === 'banana');
      expect(found).toBe('banana');
    });
  });
});
