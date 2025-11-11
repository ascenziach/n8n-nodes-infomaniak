/**
 * Unit tests for validation utilities
 */

import {
	isValidEmail,
	validateEmail,
	isValidId,
	validateId,
	parseIdArray,
	isValidLocale,
	validateLocale,
	isValidRoleType,
	validateRoleType,
} from '../nodes/InfomaniakCoreResources/utils/validation';

describe('Email Validation', () => {
	test('should validate correct email addresses', () => {
		expect(isValidEmail('test@example.com')).toBe(true);
		expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
	});

	test('should reject invalid email addresses', () => {
		expect(isValidEmail('invalid')).toBe(false);
		expect(isValidEmail('@example.com')).toBe(false);
		expect(isValidEmail('test@')).toBe(false);
		expect(isValidEmail('')).toBe(false);
	});

	test('should sanitize and validate emails', () => {
		expect(validateEmail('  test@example.com  ')).toBe('test@example.com');
		expect(() => validateEmail('invalid')).toThrow();
	});
});

describe('ID Validation', () => {
	test('should validate positive integers', () => {
		expect(isValidId(1)).toBe(true);
		expect(isValidId(100)).toBe(true);
		expect(isValidId('42')).toBe(true);
	});

	test('should reject invalid IDs', () => {
		expect(isValidId(0)).toBe(false);
		expect(isValidId(-1)).toBe(false);
		expect(isValidId(1.5)).toBe(false);
		expect(isValidId('abc')).toBe(false);
	});

	test('should validate and convert ID', () => {
		expect(validateId(42)).toBe(42);
		expect(validateId('42')).toBe(42);
		expect(() => validateId(0)).toThrow();
		expect(() => validateId('invalid')).toThrow();
	});
});

describe('Array ID Parsing', () => {
	test('should parse comma-separated IDs', () => {
		expect(parseIdArray('1,2,3')).toEqual([1, 2, 3]);
		expect(parseIdArray(' 10 , 20 , 30 ')).toEqual([10, 20, 30]);
	});

	test('should handle empty strings', () => {
		expect(parseIdArray('')).toEqual([]);
		expect(parseIdArray('   ')).toEqual([]);
	});

	test('should throw on invalid IDs', () => {
		expect(() => parseIdArray('1,abc,3')).toThrow();
	});
});

describe('Locale Validation', () => {
	test('should validate supported locales', () => {
		expect(isValidLocale('en_GB')).toBe(true);
		expect(isValidLocale('fr_FR')).toBe(true);
	});

	test('should reject invalid locales', () => {
		expect(isValidLocale('invalid')).toBe(false);
		expect(isValidLocale('en')).toBe(false);
	});

	test('should validate locale', () => {
		expect(validateLocale('en_GB')).toBe('en_GB');
		expect(() => validateLocale('invalid')).toThrow();
	});
});

describe('Role Type Validation', () => {
	test('should validate role types', () => {
		expect(isValidRoleType(0)).toBe(true);
		expect(isValidRoleType(5)).toBe(true);
	});

	test('should reject invalid role types', () => {
		expect(isValidRoleType(6)).toBe(false);
		expect(isValidRoleType(-1)).toBe(false);
		expect(isValidRoleType('0')).toBe(false);
	});

	test('should validate role type', () => {
		expect(validateRoleType(0)).toBe(0);
		expect(() => validateRoleType(6)).toThrow();
	});
});
