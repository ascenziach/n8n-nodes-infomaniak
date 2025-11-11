/**
 * Data Transformation Utilities
 *
 * Utilities for transforming data between different formats (camelCase <-> snake_case, etc.)
 */

// ============================================================================
// Case Conversion
// ============================================================================

/**
 * Converts a snake_case string to camelCase
 * @param str - The snake_case string
 * @returns The camelCase string
 */
export function snakeToCamel(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a camelCase string to snake_case
 * @param str - The camelCase string
 * @returns The snake_case string
 */
export function camelToSnake(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Recursively converts all keys in an object from snake_case to camelCase
 * @param obj - The object to convert
 * @returns Object with camelCase keys
 */
export function keysToCamel<T = Record<string, unknown>>(obj: unknown): T {
	if (obj === null || obj === undefined) {
		return obj as T;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => keysToCamel(item)) as T;
	}

	if (typeof obj === 'object' && obj.constructor === Object) {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			const camelKey = snakeToCamel(key);
			result[camelKey] = keysToCamel(value);
		}
		return result as T;
	}

	return obj as T;
}

/**
 * Recursively converts all keys in an object from camelCase to snake_case
 * @param obj - The object to convert
 * @returns Object with snake_case keys
 */
export function keysToSnake<T = Record<string, unknown>>(obj: unknown): T {
	if (obj === null || obj === undefined) {
		return obj as T;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => keysToSnake(item)) as T;
	}

	if (typeof obj === 'object' && obj.constructor === Object) {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			const snakeKey = camelToSnake(key);
			result[snakeKey] = keysToSnake(value);
		}
		return result as T;
	}

	return obj as T;
}

// ============================================================================
// Query String Building
// ============================================================================

/**
 * Builds a query string object from parameters, converting to snake_case
 * @param params - Parameters object with camelCase keys
 * @returns Query string object with snake_case keys
 */
export function buildQueryString(params: Record<string, unknown>): Record<string, unknown> {
	const qs: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			const snakeKey = camelToSnake(key);
			qs[snakeKey] = value;
		}
	}

	return qs;
}

// ============================================================================
// Request Body Building
// ============================================================================

/**
 * Builds a request body from parameters, converting to snake_case and removing empty values
 * @param params - Parameters object with camelCase keys
 * @param keepEmptyStrings - Whether to keep empty strings (default: false)
 * @returns Request body with snake_case keys
 */
export function buildRequestBody(
	params: Record<string, unknown>,
	keepEmptyStrings = false,
): Record<string, unknown> {
	const body: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) {
			continue;
		}

		if (!keepEmptyStrings && value === '') {
			continue;
		}

		const snakeKey = camelToSnake(key);
		body[snakeKey] = value;
	}

	return body;
}

// ============================================================================
// Pagination Helpers
// ============================================================================

/**
 * Calculates pagination parameters
 * @param returnAll - Whether to return all results
 * @param limit - Maximum number of results to return
 * @param defaultLimit - Default limit if none specified
 * @returns Pagination parameters
 */
export function getPaginationParams(
	returnAll: boolean,
	limit?: number,
	defaultLimit = 50,
): { returnAll: boolean; limit: number } {
	return {
		returnAll,
		limit: returnAll ? 0 : limit || defaultLimit,
	};
}

/**
 * Applies pagination to an array of results
 * @param data - Array of data to paginate
 * @param returnAll - Whether to return all results
 * @param limit - Maximum number of results
 * @returns Paginated array
 */
export function applyPagination<T>(data: T[], returnAll: boolean, limit: number): T[] {
	if (returnAll || limit <= 0) {
		return data;
	}
	return data.slice(0, limit);
}

// ============================================================================
// Response Normalization
// ============================================================================

/**
 * Normalizes an API response to ensure consistent structure
 * @param response - Raw API response
 * @returns Normalized response
 */
export function normalizeResponse<T>(response: unknown): {
	success: boolean;
	data?: T;
	error?: string;
} {
	if (!response || typeof response !== 'object') {
		return { success: false, error: 'Invalid response format' };
	}

	const resp = response as Record<string, unknown>;

	const success = resp.result === 'success';
	const data = resp.data as T | undefined;
	const error = resp.error as string | undefined;

	return { success, data, error };
}
