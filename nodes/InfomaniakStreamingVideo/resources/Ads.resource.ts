/**
 * Ads Resource Handler
 *
 * Handles operations related to advertising configurations
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { AdsConfig } from '../types';

export class AdsResource {
	/**
	 * Execute Ads operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => AdsResource.getAll(context, itemIndex),
			get: () => AdsResource.get(context, itemIndex),
			create: () => AdsResource.create(context, itemIndex),
			update: () => AdsResource.update(context, itemIndex),
			duplicate: () => AdsResource.duplicate(context, itemIndex),
			delete: () => AdsResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all ads configurations
	 * GET /1/videos/{account_id}/ads
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<AdsConfig[]>(
			context,
			`/1/videos/${accountId}/ads`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single ads configuration
	 * GET /1/videos/{account_id}/ads/{ads}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const ads = context.getNodeParameter('ads', itemIndex) as string;

		const data = await infomaniakApiRequestGET<AdsConfig>(
			context,
			`/1/videos/${accountId}/ads/${ads}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create an ads configuration
	 * POST /1/videos/{account_id}/ads
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const playerId = context.getNodeParameter('playerId', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			player_id: playerId,
		};

		if (additionalFields.enabled !== undefined) body.enabled = additionalFields.enabled;
		if (additionalFields.prerollUrl) body.preroll_url = additionalFields.prerollUrl;
		if (additionalFields.midrollUrl) body.midroll_url = additionalFields.midrollUrl;
		if (additionalFields.postrollUrl) body.postroll_url = additionalFields.postrollUrl;
		if (additionalFields.midrollInterval) body.midroll_interval = additionalFields.midrollInterval;

		const data = await infomaniakApiRequestPOST<AdsConfig>(
			context,
			`/1/videos/${accountId}/ads`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update an ads configuration
	 * PUT /1/videos/{account_id}/ads/{ads}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const ads = context.getNodeParameter('ads', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.enabled !== undefined) body.enabled = updateFields.enabled;
		if (updateFields.prerollUrl !== undefined) body.preroll_url = updateFields.prerollUrl;
		if (updateFields.midrollUrl !== undefined) body.midroll_url = updateFields.midrollUrl;
		if (updateFields.postrollUrl !== undefined) body.postroll_url = updateFields.postrollUrl;
		if (updateFields.midrollInterval !== undefined) body.midroll_interval = updateFields.midrollInterval;

		const data = await infomaniakApiRequestPUT<AdsConfig>(
			context,
			`/1/videos/${accountId}/ads/${ads}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Duplicate an ads configuration
	 * POST /1/videos/{account_id}/ads/{ads}/duplicate
	 */
	private static async duplicate(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const ads = context.getNodeParameter('ads', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<AdsConfig>(
			context,
			`/1/videos/${accountId}/ads/${ads}/duplicate`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete an ads configuration
	 * DELETE /1/videos/{account_id}/ads/{ads}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const ads = context.getNodeParameter('ads', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/videos/${accountId}/ads/${ads}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			accountId,
			ads,
			message: `Ads configuration ${ads} deleted successfully`,
		} as IDataObject);
	}
}
