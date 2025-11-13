/**
 * Player Resource Handler
 *
 * Handles operations for Streaming Radio Players
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
			create: () => PlayerResource.create(context, itemIndex),
			delete: () => PlayerResource.delete(context, itemIndex),
			get: () => PlayerResource.get(context, itemIndex),
			getAll: () => PlayerResource.getAll(context, itemIndex),
			update: () => PlayerResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a player
	 * POST /1/radios/{radio_product_id}/players
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const name = context.getNodeParameter('name', itemIndex) as string;

		const body: Record<string, unknown> = {
			name,
		};

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Player;
		}>(
			context,
			`/1/radios/${radioProductId}/players`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a player
	 * DELETE /1/radios/{radio_product_id}/players/{player_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const playerId = context.getNodeParameter('playerId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/1/radios/${radioProductId}/players/${playerId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			playerId,
			message: `Player ${playerId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a player
	 * GET /1/radios/{radio_product_id}/players/{player_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const playerId = context.getNodeParameter('playerId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Player;
		}>(
			context,
			`/1/radios/${radioProductId}/players/${playerId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many players
	 * GET /1/radios/{radio_product_id}/players
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Player[];
		}>(
			context,
			`/1/radios/${radioProductId}/players`,
			qs,
			itemIndex,
		);

		const players = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(players as unknown as IDataObject[]);
	}

	/**
	 * Update a player
	 * PUT /1/radios/{radio_product_id}/players/{player_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const playerId = context.getNodeParameter('playerId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.name) {
			body.name = updateFields.name;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Player;
		}>(
			context,
			`/1/radios/${radioProductId}/players/${playerId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
