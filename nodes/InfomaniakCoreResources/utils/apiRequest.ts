/**
 * API Request Utilities
 *
 * Centralized HTTP request handling for Infomaniak API
 */

import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';

import { API_CONFIG, ERROR_MESSAGES } from './constants';
import { InfomaniakApiResponse, QueryString, RequestBody, InfomaniakCredentials } from '../types';
import { normalizeResponse } from './transformers';
import { encodeUrlParam } from './validation';

// ============================================================================
// Core Request Function
// ============================================================================

/**
 * Determines the API version to use based on the endpoint
 * @param endpoint - The API endpoint
 * @returns API version (1 or 2)
 */
function getApiVersion(endpoint: string): number {
	// API v2 endpoints
	const v2Patterns = [
		'/profile',
		'/accounts/', // when followed by ID and /users
	];

	// Check if endpoint matches v2 patterns
	for (const pattern of v2Patterns) {
		if (endpoint.includes(pattern)) {
			// Special case: /accounts/{id}/users uses v2, but other /accounts endpoints use v1
			if (endpoint.includes('/accounts/') && endpoint.includes('/users')) {
				return 2;
			}
			if (endpoint.startsWith('/profile')) {
				return 2;
			}
		}
	}

	return 1; // Default to v1
}

/**
 * Makes an authenticated request to the Infomaniak API
 *
 * @param context - n8n execution context
 * @param method - HTTP method
 * @param endpoint - API endpoint (without base URL and version)
 * @param body - Request body
 * @param qs - Query string parameters
 * @param itemIndex - Item index for error reporting
 * @param apiVersion - Optional API version override (1 or 2)
 * @returns API response data
 * @throws NodeOperationError on failure
 */
export async function infomaniakApiRequest<T = unknown>(
	context: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
	apiVersion?: number,
): Promise<T> {
	// Get credentials
	const credentials = (await context.getCredentials('infomaniakApi')) as InfomaniakCredentials;

	if (!credentials || !credentials.apiToken) {
		throw new NodeOperationError(
			context.getNode(),
			ERROR_MESSAGES.AUTHENTICATION_FAILED,
			{ itemIndex },
		);
	}

	// Determine API version
	const version = apiVersion || getApiVersion(endpoint);

	// Build the full URL
	const url = `https://api.infomaniak.com/${version}${endpoint}`;

	// Prepare request options
	const options: IHttpRequestOptions = {
		method,
		url,
		headers: {
			Authorization: `Bearer ${credentials.apiToken}`,
			'Content-Type': 'application/json',
		},
		json: true,
		timeout: API_CONFIG.TIMEOUT,
	};

	// Add body if present
	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	// Add query string if present
	if (qs && Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		// Make the request
		const response = (await context.helpers.httpRequest(options)) as InfomaniakApiResponse<T>;

		// Normalize and validate response
		const normalized = normalizeResponse<T>(response);

		if (!normalized.success) {
			throw new NodeOperationError(
				context.getNode(),
				normalized.error || ERROR_MESSAGES.API_REQUEST_FAILED,
				{
					itemIndex,
					description: `API returned error for ${method} ${endpoint}`,
				},
			);
		}

		if (normalized.data === undefined) {
			throw new NodeOperationError(
				context.getNode(),
				ERROR_MESSAGES.INVALID_RESPONSE,
				{
					itemIndex,
					description: 'API response missing data field',
				},
			);
		}

		return normalized.data;
	} catch (error) {
		// Handle HTTP errors
		if (error instanceof NodeOperationError) {
			throw error;
		}

		// Handle other errors
		const errorMessage =
			error instanceof Error ? error.message : ERROR_MESSAGES.API_REQUEST_FAILED;

		throw new NodeOperationError(context.getNode(), errorMessage, {
			itemIndex,
			description: `Failed to execute ${method} request to ${endpoint}`,
		});
	}
}

// ============================================================================
// Convenience Methods
// ============================================================================

/**
 * Makes a GET request to the Infomaniak API
 */
export async function infomaniakApiRequestGET<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return infomaniakApiRequest<T>(context, 'GET', endpoint, undefined, qs, itemIndex);
}

/**
 * Makes a POST request to the Infomaniak API
 */
export async function infomaniakApiRequestPOST<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return infomaniakApiRequest<T>(context, 'POST', endpoint, body, qs, itemIndex);
}

/**
 * Makes a PUT request to the Infomaniak API
 */
export async function infomaniakApiRequestPUT<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return infomaniakApiRequest<T>(context, 'PUT', endpoint, body, qs, itemIndex);
}

/**
 * Makes a PATCH request to the Infomaniak API
 */
export async function infomaniakApiRequestPATCH<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return infomaniakApiRequest<T>(context, 'PATCH', endpoint, body, qs, itemIndex);
}

/**
 * Makes a DELETE request to the Infomaniak API
 */
export async function infomaniakApiRequestDELETE<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return infomaniakApiRequest<T>(context, 'DELETE', endpoint, undefined, qs, itemIndex);
}

// ============================================================================
// URL Building Helpers
// ============================================================================

/**
 * Builds a URL with safely encoded path parameters
 * @param parts - URL parts to join
 * @returns Encoded URL
 */
export function buildUrl(...parts: Array<string | number>): string {
	return parts.map((part) => encodeUrlParam(part)).join('/');
}

/**
 * Builds an endpoint URL from a template and parameters
 * @param template - URL template (e.g., '/actions/{id}')
 * @param params - Parameters to replace in template
 * @returns Built endpoint URL
 */
export function buildEndpoint(template: string, params: Record<string, string | number>): string {
	let endpoint = template;
	for (const [key, value] of Object.entries(params)) {
		endpoint = endpoint.replace(`{${key}}`, encodeUrlParam(value));
	}
	return endpoint;
}
