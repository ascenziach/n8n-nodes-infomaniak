/**
 * Player Resource Handler
 *
 * Handles operations related to video players
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Player } from '../types';

export class PlayerResource {
	/**
	 * Execute Player operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => PlayerResource.getAll(context, itemIndex),
			get: () => PlayerResource.get(context, itemIndex),
			create: () => PlayerResource.create(context, itemIndex),
			update: () => PlayerResource.update(context, itemIndex),
			copy: () => PlayerResource.copy(context, itemIndex),
			delete: () => PlayerResource.delete(context, itemIndex),
			getThumbnail: () => PlayerResource.getThumbnail(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all players
	 * GET /1/videos/{account_id}/players
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<Player[]>(
			context,
			`/1/videos/${accountId}/players`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single player
	 * GET /1/videos/{account_id}/players/{player}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const player = context.getNodeParameter('player', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Player>(
			context,
			`/1/videos/${accountId}/players/${player}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a player
	 * POST /1/videos/{account_id}/players
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

		if (additionalFields.slug) body.slug = additionalFields.slug;
		if (additionalFields.channelId) body.channel_id = additionalFields.channelId;
		if (additionalFields.theme) body.theme = additionalFields.theme;
		if (additionalFields.autoplay !== undefined) body.autoplay = additionalFields.autoplay;
		if (additionalFields.controls !== undefined) body.controls = additionalFields.controls;

		const data = await infomaniakApiRequestPOST<Player>(
			context,
			`/1/videos/${accountId}/players`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a player
	 * PUT /1/videos/{account_id}/players/{player}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const player = context.getNodeParameter('player', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.slug) body.slug = updateFields.slug;
		if (updateFields.channelId) body.channel_id = updateFields.channelId;
		if (updateFields.theme) body.theme = updateFields.theme;
		if (updateFields.autoplay !== undefined) body.autoplay = updateFields.autoplay;
		if (updateFields.controls !== undefined) body.controls = updateFields.controls;

		const data = await infomaniakApiRequestPUT<Player>(
			context,
			`/1/videos/${accountId}/players/${player}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Copy/duplicate a player
	 * POST /1/videos/{account_id}/players/{player}/copy
	 */
	private static async copy(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const player = context.getNodeParameter('player', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (additionalFields.name) body.name = additionalFields.name;

		const data = await infomaniakApiRequestPOST<Player>(
			context,
			`/1/videos/${accountId}/players/${player}/copy`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a player
	 * DELETE /1/videos/{account_id}/players/{player}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const player = context.getNodeParameter('player', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/videos/${accountId}/players/${player}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			accountId,
			player,
			message: `Player ${player} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get player thumbnail
	 * GET /1/videos/{account_id}/players/{player}/thumbnail
	 */
	private static async getThumbnail(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const player = context.getNodeParameter('player', itemIndex) as string;

		const data = await infomaniakApiRequestGET<{ url: string }>(
			context,
			`/1/videos/${accountId}/players/${player}/thumbnail`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
