/**
 * Constants used throughout the Infomaniak node
 */

import { Locale, RoleType } from '../types';

// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
	BASE_URL: 'https://api.infomaniak.com/1',
	TIMEOUT: 30000,
	MAX_RETRIES: 3,
	DEFAULT_LIMIT: 50,
} as const;

// ============================================================================
// Locales
// ============================================================================

export const SUPPORTED_LOCALES: Array<{ name: string; value: Locale }> = [
	{ name: 'German (Switzerland)', value: 'de_CH' },
	{ name: 'German (Germany)', value: 'de_DE' },
	{ name: 'English (UK)', value: 'en_GB' },
	{ name: 'English (US)', value: 'en_US' },
	{ name: 'Spanish (Spain)', value: 'es_ES' },
	{ name: 'French (Switzerland)', value: 'fr_CH' },
	{ name: 'French (France)', value: 'fr_FR' },
	{ name: 'Italian (Switzerland)', value: 'it_CH' },
	{ name: 'Italian (Italy)', value: 'it_IT' },
];

export const LOCALE_VALUES = SUPPORTED_LOCALES.map((l) => l.value);

// ============================================================================
// Role Types
// ============================================================================

export const ROLE_TYPES: Array<{ name: string; value: RoleType }> = [
	{ name: 'Administrator', value: 0 },
	{ name: 'Manager', value: 1 },
	{ name: 'Editor', value: 2 },
	{ name: 'Contributor', value: 3 },
	{ name: 'Viewer', value: 4 },
	{ name: 'Guest', value: 5 },
];

export const ROLE_TYPE_VALUES = ROLE_TYPES.map((r) => r.value);

// ============================================================================
// Validation Patterns
// ============================================================================

export const VALIDATION_PATTERNS = {
	/**
	 * RFC 5322 compliant email regex (simplified)
	 */
	EMAIL:
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

	/**
	 * Positive integer pattern
	 */
	POSITIVE_INTEGER: /^\d+$/,

	/**
	 * UUID pattern
	 */
	UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;

// ============================================================================
// HTTP Methods
// ============================================================================

export const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
	INVALID_EMAIL: 'Invalid email address format',
	INVALID_ID: 'Invalid ID: must be a positive integer',
	INVALID_LOCALE: 'Invalid locale. Must be one of: ' + LOCALE_VALUES.join(', '),
	INVALID_ROLE_TYPE: 'Invalid role type. Must be one of: ' + ROLE_TYPE_VALUES.join(', '),
	MISSING_REQUIRED_FIELD: (field: string) => `Missing required field: ${field}`,
	API_REQUEST_FAILED: 'API request failed',
	INVALID_RESPONSE: 'Invalid API response format',
	AUTHENTICATION_FAILED: 'Authentication failed. Please check your API token.',
	RESOURCE_NOT_FOUND: (resource: string, id: string | number) =>
		`${resource} with ID ${id} not found`,
} as const;

// ============================================================================
// Product Types (for kSuite)
// ============================================================================

export const PRODUCT_TYPES = [
	'ksuite',
	'mail',
	'drive',
	'kmeet',
	'notes',
	'chat',
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];
