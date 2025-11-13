/**
 * RadioProduct Resource Handler
 *
 * Handles operations for Streaming Radio Products
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	applyPagination,
} from '../utils';
import { RadioProduct } from '../types';

export class RadioProductResource {
	/**
	 * Execute RadioProduct operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			get: () => RadioProductResource.get(context, itemIndex),
			getAll: () => RadioProductResource.getAll(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get a radio product
	 * GET /1/radios/{radio_product_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: RadioProduct;
		}>(
			context,
			`/1/radios/${radioProductId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many radio products
	 * GET /1/radios
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: RadioProduct[];
		}>(
			context,
			'/1/radios',
			qs,
			itemIndex,
		);

		const radioProducts = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(radioProducts as unknown as IDataObject[]);
	}
}
