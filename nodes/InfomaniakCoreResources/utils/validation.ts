/**
 * Validation Utilities
 *
 * This module provides robust validation functions for user inputs and API data.
 */

import { VALIDATION_PATTERNS, ERROR_MESSAGES, LOCALE_VALUES, ROLE_TYPE_VALUES } from './constants';
import { Locale, RoleType } from '../types';

// ============================================================================
// Email Validation
// ============================================================================

/**
 * Validates an email address using RFC 5322 compliant regex
 * @param email - The email address to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
	if (!email || typeof email !== 'string') {
		return false;
	}
	return VALIDATION_PATTERNS.EMAIL.test(email.trim());
}

/**
 * Validates and sanitizes an email address
 * @param email - The email address to validate
 * @returns The sanitized email
 * @throws Error if email is invalid
 */
export function validateEmail(email: string): string {
	const sanitized = email.trim();
	if (!isValidEmail(sanitized)) {
		throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
	}
	return sanitized;
}

// ============================================================================
// ID Validation
// ============================================================================

/**
 * Validates that a value is a positive integer
 * @param id - The ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidId(id: unknown): id is number {
	if (typeof id === 'number') {
		return Number.isInteger(id) && id > 0;
	}
	if (typeof id === 'string') {
		return VALIDATION_PATTERNS.POSITIVE_INTEGER.test(id) && parseInt(id, 10) > 0;
	}
	return false;
}

/**
 * Validates and converts an ID to a number
 * @param id - The ID to validate
 * @returns The validated ID as a number
 * @throws Error if ID is invalid
 */
export function validateId(id: unknown): number {
	if (typeof id === 'number') {
		if (!isValidId(id)) {
			throw new Error(ERROR_MESSAGES.INVALID_ID);
		}
		return id;
	}
	if (typeof id === 'string') {
		const parsed = parseInt(id.trim(), 10);
		if (!isValidId(parsed)) {
			throw new Error(ERROR_MESSAGES.INVALID_ID);
		}
		return parsed;
	}
	throw new Error(ERROR_MESSAGES.INVALID_ID);
}

// ============================================================================
// Array ID Validation
// ============================================================================

/**
 * Parses and validates a comma-separated string of IDs
 * @param idString - Comma-separated ID string
 * @returns Array of validated IDs
 * @throws Error if any ID is invalid
 */
export function parseIdArray(idString: string): number[] {
	if (!idString || typeof idString !== 'string') {
		return [];
	}

	const ids = idString
		.split(',')
		.map((id) => id.trim())
		.filter((id) => id.length > 0);

	return ids.map((id) => {
		const parsed = parseInt(id, 10);
		if (!isValidId(parsed)) {
			throw new Error(`${ERROR_MESSAGES.INVALID_ID}: "${id}"`);
		}
		return parsed;
	});
}

// ============================================================================
// Locale Validation
// ============================================================================

/**
 * Validates a locale string
 * @param locale - The locale to validate
 * @returns True if valid, false otherwise
 */
export function isValidLocale(locale: string): locale is Locale {
	return LOCALE_VALUES.includes(locale as Locale);
}

/**
 * Validates a locale
 * @param locale - The locale to validate
 * @returns The validated locale
 * @throws Error if locale is invalid
 */
export function validateLocale(locale: string): Locale {
	if (!isValidLocale(locale)) {
		throw new Error(ERROR_MESSAGES.INVALID_LOCALE);
	}
	return locale;
}

// ============================================================================
// Role Type Validation
// ============================================================================

/**
 * Validates a role type value
 * @param roleType - The role type to validate
 * @returns True if valid, false otherwise
 */
export function isValidRoleType(roleType: unknown): roleType is RoleType {
	return typeof roleType === 'number' && ROLE_TYPE_VALUES.includes(roleType as RoleType);
}

/**
 * Validates a role type
 * @param roleType - The role type to validate
 * @returns The validated role type
 * @throws Error if role type is invalid
 */
export function validateRoleType(roleType: unknown): RoleType {
	if (!isValidRoleType(roleType)) {
		throw new Error(ERROR_MESSAGES.INVALID_ROLE_TYPE);
	}
	return roleType;
}

// ============================================================================
// String Validation
// ============================================================================

/**
 * Validates that a string is not empty after trimming
 * @param value - The string to validate
 * @returns True if valid, false otherwise
 */
export function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates and sanitizes a string
 * @param value - The string to validate
 * @param fieldName - Name of the field for error messages
 * @returns The sanitized string
 * @throws Error if string is empty
 */
export function validateNonEmptyString(value: unknown, fieldName: string): string {
	if (!isNonEmptyString(value)) {
		throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELD(fieldName));
	}
	return value.trim();
}

// ============================================================================
// URL Encoding
// ============================================================================

/**
 * Safely encodes a URL parameter
 * @param param - The parameter to encode
 * @returns The encoded parameter
 */
export function encodeUrlParam(param: string | number): string {
	return encodeURIComponent(String(param));
}

// ============================================================================
// JSON Validation
// ============================================================================

/**
 * Safely parses JSON with error handling
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed JSON or fallback value
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
	try {
		return JSON.parse(jsonString) as T;
	} catch {
		return fallback;
	}
}

/**
 * Safely parses JSON or returns the value if already parsed
 * @param value - The value to parse (string or already parsed object)
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value or fallback
 */
export function parseOrReturn<T>(value: string | T, fallback: T): T {
	if (typeof value === 'string') {
		return safeJsonParse(value, fallback);
	}
	return value;
}
