/**
 * Language Resource Handler
 *
 * Handles operations related to Infomaniak Languages
 */

import { IExecuteFunctions, INodeExecutionData , IDataObject } from 'n8n-workflow';
import { infomaniakApiRequestGET, buildQueryString, applyPagination } from '../utils';
import { Language } from '../types';

export class LanguageResource {
	/**
	 * Execute Language operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'getAll') {
			return await LanguageResource.getAll(context, itemIndex);
		} else if (operation === 'get') {
			return await LanguageResource.get(context, itemIndex);
		}

		return [];
	}

	/**
	 * Get all languages
	 * GET /languages
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const search = context.getNodeParameter('search', itemIndex, '') as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Build query string
		const qs = buildQueryString({
			...(search && { search }),
		});

		// Make API request
		const data = await infomaniakApiRequestGET<Language[]>(
			context,
			'/languages',
			qs,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		// Return as n8n data
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single language by ID
	 * GET /languages/{language_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const languageId = context.getNodeParameter('languageId', itemIndex) as number;

		// Make API request
		const data = await infomaniakApiRequestGET<Language>(
			context,
			`/languages/${languageId}`,
			undefined,
			itemIndex,
		);

		// Return as n8n data
		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
