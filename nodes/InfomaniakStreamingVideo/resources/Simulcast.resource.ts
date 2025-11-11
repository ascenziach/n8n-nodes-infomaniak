/**
 * Simulcast Resource Handler
 *
 * Handles operations related to simulcast configurations
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { SimulcastConfig } from '../types';

export class SimulcastResource {
	/**
	 * Execute Simulcast operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => SimulcastResource.getAll(context, itemIndex),
			get: () => SimulcastResource.get(context, itemIndex),
			create: () => SimulcastResource.create(context, itemIndex),
			update: () => SimulcastResource.update(context, itemIndex),
			delete: () => SimulcastResource.delete(context, itemIndex),
			enable: () => SimulcastResource.enable(context, itemIndex),
			disable: () => SimulcastResource.disable(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all simulcasts for a channel
	 * GET /1/videos/{account_id}/channels/{channel}/simulcasts
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<SimulcastConfig[]>(
			context,
			`/1/videos/${accountId}/channels/${channel}/simulcasts`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single simulcast
	 * GET /1/videos/{account_id}/channels/{channel}/simulcasts/{simulcast}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const simulcast = context.getNodeParameter('simulcast', itemIndex) as string;

		const data = await infomaniakApiRequestGET<SimulcastConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/simulcasts/${simulcast}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a simulcast
	 * POST /1/videos/{account_id}/channels/{channel}/simulcasts
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const name = context.getNodeParameter('name', itemIndex) as string;
		const platform = context.getNodeParameter('platform', itemIndex) as string;
		const url = context.getNodeParameter('url', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			name,
			platform,
			url,
		};

		if (additionalFields.streamKey) body.stream_key = additionalFields.streamKey;
		if (additionalFields.enabled !== undefined) body.enabled = additionalFields.enabled;

		const data = await infomaniakApiRequestPOST<SimulcastConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/simulcasts`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a simulcast
	 * PUT /1/videos/{account_id}/channels/{channel}/simulcasts/{simulcast}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const simulcast = context.getNodeParameter('simulcast', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.platform) body.platform = updateFields.platform;
		if (updateFields.url) body.url = updateFields.url;
		if (updateFields.streamKey !== undefined) body.stream_key = updateFields.streamKey;
		if (updateFields.enabled !== undefined) body.enabled = updateFields.enabled;

		const data = await infomaniakApiRequestPUT<SimulcastConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/simulcasts/${simulcast}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a simulcast
	 * DELETE /1/videos/{account_id}/channels/{channel}/simulcasts/{simulcast}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const simulcast = context.getNodeParameter('simulcast', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/videos/${accountId}/channels/${channel}/simulcasts/${simulcast}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			accountId,
			channel,
			simulcast,
			message: `Simulcast ${simulcast} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Enable a simulcast
	 * POST /1/videos/{account_id}/channels/{channel}/simulcasts/{simulcast}/enable
	 */
	private static async enable(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const simulcast = context.getNodeParameter('simulcast', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<SimulcastConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/simulcasts/${simulcast}/enable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Disable a simulcast
	 * POST /1/videos/{account_id}/channels/{channel}/simulcasts/{simulcast}/disable
	 */
	private static async disable(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const simulcast = context.getNodeParameter('simulcast', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<SimulcastConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/simulcasts/${simulcast}/disable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
