/**
 * Channel Resource Handler
 *
 * Handles operations related to streaming channels
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Channel } from '../types';

export class ChannelResource {
	/**
	 * Execute Channel operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => ChannelResource.getAll(context, itemIndex),
			get: () => ChannelResource.get(context, itemIndex),
			create: () => ChannelResource.create(context, itemIndex),
			update: () => ChannelResource.update(context, itemIndex),
			delete: () => ChannelResource.delete(context, itemIndex),
			getThumbnail: () => ChannelResource.getThumbnail(context, itemIndex),
			configureEncoding: () => ChannelResource.configureEncoding(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all channels
	 * GET /1/videos/{account_id}/channels
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<Channel[]>(
			context,
			`/1/videos/${accountId}/channels`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single channel
	 * GET /1/videos/{account_id}/channels/{channel}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Channel>(
			context,
			`/1/videos/${accountId}/channels/${channel}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a channel
	 * POST /1/videos/{account_id}/channels
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const name = context.getNodeParameter('name', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			name,
		};

		if (additionalFields.description) body.description = additionalFields.description;
		if (additionalFields.slug) body.slug = additionalFields.slug;
		if (additionalFields.encodingProfile) body.encoding_profile = additionalFields.encodingProfile;

		const data = await infomaniakApiRequestPOST<Channel>(
			context,
			`/1/videos/${accountId}/channels`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a channel
	 * PUT /1/videos/{account_id}/channels/{channel}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.slug) body.slug = updateFields.slug;
		if (updateFields.encodingProfile) body.encoding_profile = updateFields.encodingProfile;

		const data = await infomaniakApiRequestPUT<Channel>(
			context,
			`/1/videos/${accountId}/channels/${channel}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a channel
	 * DELETE /1/videos/{account_id}/channels/{channel}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/videos/${accountId}/channels/${channel}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			accountId,
			channel,
			message: `Channel ${channel} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get channel thumbnail
	 * GET /1/videos/{account_id}/channels/{channel}/thumbnail
	 */
	private static async getThumbnail(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestGET<{ url: string }>(
			context,
			`/1/videos/${accountId}/channels/${channel}/thumbnail`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Configure encoding settings
	 * PUT /1/videos/{account_id}/channels/{channel}/encoding
	 */
	private static async configureEncoding(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const encodingProfile = context.getNodeParameter('encodingProfile', itemIndex) as string;

		const body: Record<string, unknown> = {
			encoding_profile: encodingProfile,
		};

		const data = await infomaniakApiRequestPUT<Channel>(
			context,
			`/1/videos/${accountId}/channels/${channel}/encoding`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
