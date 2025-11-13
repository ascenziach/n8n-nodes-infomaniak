/**
 * Media Resource Handler
 *
 * Handles operations for VOD Media
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Media } from '../types';

export class MediaResource {
	/**
	 * Execute Media operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			delete: () => MediaResource.delete(context, itemIndex),
			get: () => MediaResource.get(context, itemIndex),
			getAll: () => MediaResource.getAll(context, itemIndex),
			update: () => MediaResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Delete a media
	 * DELETE /1/vod/channel/{channel}/media/{media}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const mediaId = context.getNodeParameter('mediaId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/vod/channel/${channelId}/media/${mediaId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mediaId,
			message: `Media ${mediaId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a media
	 * GET /1/vod/channel/{channel}/media/{media}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const mediaId = context.getNodeParameter('mediaId', itemIndex) as string;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Media;
		}>(
			context,
			`/1/vod/channel/${channelId}/media/${mediaId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many media
	 * GET /1/vod/channel/{channel}/media
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Media[];
		}>(
			context,
			`/1/vod/channel/${channelId}/media`,
			qs,
			itemIndex,
		);

		const media = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(media as unknown as IDataObject[]);
	}

	/**
	 * Update a media
	 * PUT /1/vod/channel/{channel}/media/{media}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const mediaId = context.getNodeParameter('mediaId', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.title) {
			body.title = updateFields.title;
		}

		if (updateFields.description !== undefined) {
			body.description = updateFields.description;
		}

		if (updateFields.published !== undefined) {
			body.published = updateFields.published;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Media;
		}>(
			context,
			`/1/vod/channel/${channelId}/media/${mediaId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
