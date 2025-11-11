/**
 * Product Resource Handler
 *
 * Handles operations related to Infomaniak Products
 */

import { IExecuteFunctions, INodeExecutionData , IDataObject } from 'n8n-workflow';
import { infomaniakApiRequestGET, applyPagination } from '../utils';
import { Product } from '../types';

export class ProductResource {
	/**
	 * Execute Product operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'getAll') {
			return await ProductResource.getAll(context, itemIndex);
		}

		return [];
	}

	/**
	 * Get all products
	 * GET /products
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Make API request
		const data = await infomaniakApiRequestGET<Product[]>(
			context,
			'/products',
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		// Return as n8n data
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}
}
