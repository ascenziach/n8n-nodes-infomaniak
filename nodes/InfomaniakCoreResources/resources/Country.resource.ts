/**
 * Country Resource Handler
 *
 * Handles operations related to Infomaniak Countries
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { infomaniakApiRequestGET, buildQueryString, applyPagination, parseIdArray } from '../utils';
import { Country } from '../types';

export class CountryResource {
	/**
	 * Execute Country operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'getAll') {
			return await CountryResource.getAll(context, itemIndex);
		} else if (operation === 'get') {
			return await CountryResource.get(context, itemIndex);
		}

		return [];
	}

	/**
	 * Get all countries
	 * GET /countries
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const search = context.getNodeParameter('search', itemIndex, '') as string;
		const onlyEnabled = context.getNodeParameter('onlyEnabled', itemIndex, false) as boolean;
		const onlyEnabledException = context.getNodeParameter('onlyEnabledException', itemIndex, '') as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, unknown>;

		// Parse exception IDs if provided
		const exceptionIds = onlyEnabledException && onlyEnabled
			? parseIdArray(onlyEnabledException)
			: undefined;

		// Build query string
		const qsObj: any = {};
		if (search) qsObj.search = search;
		if (onlyEnabled) qsObj.onlyEnabled = onlyEnabled;
		if (exceptionIds) qsObj.onlyEnabledException = exceptionIds;
		if (additionalOptions.orderBy) qsObj.orderBy = additionalOptions.orderBy;
		if (additionalOptions.order) qsObj.order = additionalOptions.order;
		if (additionalOptions.page) qsObj.page = additionalOptions.page;
		if (additionalOptions.perPage) qsObj.perPage = additionalOptions.perPage;
		const qs = buildQueryString(qsObj);

		// Make API request
		const data = await infomaniakApiRequestGET<Country[]>(
			context,
			'/countries',
			qs,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		// Return as n8n data
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single country by ID
	 * GET /countries/{country_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const countryId = context.getNodeParameter('countryId', itemIndex) as number;

		// Make API request
		const data = await infomaniakApiRequestGET<Country>(
			context,
			`/countries/${countryId}`,
			undefined,
			itemIndex,
		);

		// Return as n8n data
		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
