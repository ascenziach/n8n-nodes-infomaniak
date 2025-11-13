/**
 * Channel Resource Handler
 *
 * Handles operations for VOD Channels
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
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
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get many channels
	 * GET /1/vod/channel
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
			data: Channel[];
		}>(
			context,
			'/1/vod/channel',
			qs,
			itemIndex,
		);

		const channels = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(channels as unknown as IDataObject[]);
	}
}
