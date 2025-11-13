/**
 * Folder Resource Handler
 *
 * Handles operations for VOD Folders
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Folder } from '../types';

export class FolderResource {
	/**
	 * Execute Folder operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => FolderResource.create(context, itemIndex),
			delete: () => FolderResource.delete(context, itemIndex),
			get: () => FolderResource.get(context, itemIndex),
			getAll: () => FolderResource.getAll(context, itemIndex),
			update: () => FolderResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a folder
	 * POST /1/vod/channel/{channel}/folder
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Folder;
		}>(
			context,
			`/1/vod/channel/${channelId}/folder`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a folder
	 * DELETE /1/vod/channel/{channel}/folder/{folder}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const folderId = context.getNodeParameter('folderId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/vod/channel/${channelId}/folder/${folderId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			folderId,
			message: `Folder ${folderId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a folder
	 * GET /1/vod/channel/{channel}/folder/{folder}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const folderId = context.getNodeParameter('folderId', itemIndex) as string;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Folder;
		}>(
			context,
			`/1/vod/channel/${channelId}/folder/${folderId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many folders
	 * GET /1/vod/channel/{channel}/folder
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
			data: Folder[];
		}>(
			context,
			`/1/vod/channel/${channelId}/folder`,
			qs,
			itemIndex,
		);

		const folders = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(folders as unknown as IDataObject[]);
	}

	/**
	 * Update a folder
	 * PUT /1/vod/channel/{channel}/folder/{folder}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const folderId = context.getNodeParameter('folderId', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.name) {
			body.name = updateFields.name;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Folder;
		}>(
			context,
			`/1/vod/channel/${channelId}/folder/${folderId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
