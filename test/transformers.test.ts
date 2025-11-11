/**
 * Unit tests for transformer utilities
 */

import {
	snakeToCamel,
	camelToSnake,
	keysToCamel,
	keysToSnake,
	buildQueryString,
	applyPagination,
} from '../nodes/InfomaniakCoreResources/utils/transformers';

describe('Case Conversion', () => {
	test('should convert snake_case to camelCase', () => {
		expect(snakeToCamel('first_name')).toBe('firstName');
		expect(snakeToCamel('api_token')).toBe('apiToken');
	});

	test('should convert camelCase to snake_case', () => {
		expect(camelToSnake('firstName')).toBe('first_name');
		expect(camelToSnake('apiToken')).toBe('api_token');
	});

	test('should convert object keys to camelCase', () => {
		const input = { first_name: 'John', last_name: 'Doe' };
		const expected = { firstName: 'John', lastName: 'Doe' };
		expect(keysToCamel(input)).toEqual(expected);
	});

	test('should convert object keys to snake_case', () => {
		const input = { firstName: 'John', lastName: 'Doe' };
		const expected = { first_name: 'John', last_name: 'Doe' };
		expect(keysToSnake(input)).toEqual(expected);
	});

	test('should handle nested objects', () => {
		const input = { user_info: { first_name: 'John' } };
		const expected = { userInfo: { firstName: 'John' } };
		expect(keysToCamel(input)).toEqual(expected);
	});
});

describe('Query String Building', () => {
	test('should build query string from parameters', () => {
		const params = { searchTerm: 'test', pageSize: 10 };
		const result = buildQueryString(params);
		expect(result).toEqual({ search_term: 'test', page_size: 10 });
	});

	test('should skip undefined and null values', () => {
		const params = { search: 'test', page: undefined, limit: null };
		const result = buildQueryString(params);
		expect(result).toEqual({ search: 'test' });
	});

	test('should skip empty strings', () => {
		const params = { search: '', name: 'test' };
		const result = buildQueryString(params);
		expect(result).toEqual({ name: 'test' });
	});
});

describe('Pagination', () => {
	test('should apply pagination limit', () => {
		const data = [1, 2, 3, 4, 5];
		expect(applyPagination(data, false, 3)).toEqual([1, 2, 3]);
	});

	test('should return all when returnAll is true', () => {
		const data = [1, 2, 3, 4, 5];
		expect(applyPagination(data, true, 2)).toEqual([1, 2, 3, 4, 5]);
	});

	test('should return all when limit is 0 or negative', () => {
		const data = [1, 2, 3, 4, 5];
		expect(applyPagination(data, false, 0)).toEqual([1, 2, 3, 4, 5]);
		expect(applyPagination(data, false, -1)).toEqual([1, 2, 3, 4, 5]);
	});
});
