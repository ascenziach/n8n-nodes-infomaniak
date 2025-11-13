/**
 * Short URL Resource Handler
 *
 * Handles operations for URL Shortener
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
} from '../utils';
import { ShortUrl, ShortUrlQuota } from '../types';

export class ShortUrlResource {
	/**
	 * Execute Short URL operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			list: () => ShortUrlResource.list(context, itemIndex),
			create: () => ShortUrlResource.create(context, itemIndex),
			update: () => ShortUrlResource.update(context, itemIndex),
			getQuota: () => ShortUrlResource.getQuota(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * List short URLs
	 * GET /2/url-shortener
	 */
	private static async list(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (additionalFields.order_by) {
			qs.order_by = additionalFields.order_by as string;
		}
		if (additionalFields.order_direction) {
			qs.order_direction = additionalFields.order_direction as string;
		}
		if (additionalFields.search) {
			qs.search = additionalFields.search as string;
		}
		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: ShortUrl[];
			total: number;
			page: number;
			pages: number;
			items_per_page: number;
		}>(
			context,
			'/2/url-shortener',
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject[]);
	}

	/**
	 * Create a short URL
	 * POST /2/url-shortener
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const url = context.getNodeParameter('url', itemIndex) as string;
		const expirationDate = context.getNodeParameter('expirationDate', itemIndex, '') as string;

		const body: Record<string, unknown> = {
			url,
		};

		if (expirationDate) {
			// Convert ISO date to Unix timestamp
			const timestamp = Math.floor(new Date(expirationDate).getTime() / 1000);
			body.expiration_date = timestamp;
		}

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: ShortUrl;
		}>(
			context,
			'/2/url-shortener',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Update a short URL
	 * PUT /1/url-shortener/{short_url_code}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const shortUrlCode = context.getNodeParameter('shortUrlCode', itemIndex) as string;
		const expirationDate = context.getNodeParameter('expirationDate', itemIndex) as string;

		// Convert ISO date to Unix timestamp
		const timestamp = Math.floor(new Date(expirationDate).getTime() / 1000);

		const body: Record<string, unknown> = {
			expiration_date: timestamp,
		};

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: ShortUrl;
		}>(
			context,
			`/1/url-shortener/${shortUrlCode}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get quota
	 * GET /2/url-shortener/quota
	 */
	private static async getQuota(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const response = await infomaniakApiRequestGET<{
			result: string;
			data: ShortUrlQuota;
		}>(
			context,
			'/2/url-shortener/quota',
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
