/**
 * API Request Utilities for kChat
 *
 * kChat uses a different API structure (/api/v4/) compared to other Infomaniak APIs
 */

import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';

interface InfomaniakCredentials {
	apiToken: string;
}

interface QueryString {
	[key: string]: string | number | boolean | number[] | undefined;
}

type RequestBody = Record<string, unknown>;

/**
 * Makes an authenticated request to the Infomaniak kChat API
 */
export async function kChatApiRequest<T = unknown>(
	context: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	// Get credentials
	const credentials = (await context.getCredentials('infomaniakApi')) as InfomaniakCredentials;

	if (!credentials || !credentials.apiToken) {
		throw new NodeOperationError(
			context.getNode(),
			'Authentication failed: API token not found',
			{ itemIndex },
		);
	}

	// Build the full URL - kChat uses /api/v4/ structure
	const url = `https://api.infomaniak.com/api/v4${endpoint}`;

	// Prepare request options
	const options: IHttpRequestOptions = {
		method,
		url,
		headers: {
			Authorization: `Bearer ${credentials.apiToken}`,
			'Content-Type': 'application/json',
		},
		json: true,
		timeout: 30000,
	};

	// Add query string if provided
	if (qs && Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	// Add body if provided
	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		// Make the HTTP request
		const response = await context.helpers.httpRequest(options);
		return response as T;
	} catch (error) {
		// Handle HTTP errors
		if (error instanceof NodeOperationError) {
			throw error;
		}

		// Handle other errors
		const errorMessage =
			error instanceof Error ? error.message : 'kChat API request failed';

		throw new NodeOperationError(context.getNode(), errorMessage, {
			itemIndex,
			description: `Failed to execute ${method} request to ${endpoint}`,
		});
	}
}

/**
 * Makes a GET request to the kChat API
 */
export async function kChatApiRequestGET<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return kChatApiRequest<T>(context, 'GET', endpoint, undefined, qs, itemIndex);
}

/**
 * Makes a POST request to the kChat API
 */
export async function kChatApiRequestPOST<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return kChatApiRequest<T>(context, 'POST', endpoint, body, qs, itemIndex);
}

/**
 * Makes a PUT request to the kChat API
 */
export async function kChatApiRequestPUT<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return kChatApiRequest<T>(context, 'PUT', endpoint, body, qs, itemIndex);
}

/**
 * Makes a PATCH request to the kChat API
 */
export async function kChatApiRequestPATCH<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	body?: RequestBody,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return kChatApiRequest<T>(context, 'PATCH', endpoint, body, qs, itemIndex);
}

/**
 * Makes a DELETE request to the kChat API
 */
export async function kChatApiRequestDELETE<T = unknown>(
	context: IExecuteFunctions,
	endpoint: string,
	qs?: QueryString,
	itemIndex = 0,
): Promise<T> {
	return kChatApiRequest<T>(context, 'DELETE', endpoint, undefined, qs, itemIndex);
}
