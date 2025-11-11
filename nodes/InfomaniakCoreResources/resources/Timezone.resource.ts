/**
 * Timezone Resource Handler
 *
 * Handles operations related to Infomaniak Timezones
 */

import { IExecuteFunctions, INodeExecutionData , IDataObject } from 'n8n-workflow';
import { infomaniakApiRequestGET, buildQueryString, applyPagination } from '../utils';
import { Timezone } from '../types';

export class TimezoneResource {
	/**
	 * Execute Timezone operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'getAll') {
			return await TimezoneResource.getAll(context, itemIndex);
		} else if (operation === 'get') {
			return await TimezoneResource.get(context, itemIndex);
		}

		return [];
	}

	/**
	 * Get all timezones
	 * GET /timezones
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
		const data = await infomaniakApiRequestGET<Timezone[]>(
			context,
			'/timezones',
			qs,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		// Return as n8n data
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single timezone by ID
	 * GET /timezones/{timezone_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const timezoneId = context.getNodeParameter('timezoneId', itemIndex) as number;

		// Make API request
		const data = await infomaniakApiRequestGET<Timezone>(
			context,
			`/timezones/${timezoneId}`,
			undefined,
			itemIndex,
		);

		// Return as n8n data
		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
