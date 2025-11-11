/**
 * Integration Resource Handler
 *
 * Handles operations related to integration codes and embed URLs
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
} from '../utils';
import { IntegrationCode, EmbedUrl } from '../types';

export class IntegrationResource {
	/**
	 * Execute Integration operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getChannelCode: () => IntegrationResource.getChannelCode(context, itemIndex),
			getPlayerEmbedCode: () => IntegrationResource.getPlayerEmbedCode(context, itemIndex),
			getPlayerEmbedUrl: () => IntegrationResource.getPlayerEmbedUrl(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get channel integration code
	 * GET /1/videos/{account_id}/channels/{channel}/integration/code
	 */
	private static async getChannelCode(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestGET<IntegrationCode>(
			context,
			`/1/videos/${accountId}/channels/${channel}/integration/code`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get player embed code
	 * GET /1/videos/{account_id}/players/{player}/embed/code
	 */
	private static async getPlayerEmbedCode(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const player = context.getNodeParameter('player', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = {};
		if (additionalFields.width) qs.width = additionalFields.width;
		if (additionalFields.height) qs.height = additionalFields.height;
		if (additionalFields.autoplay !== undefined) qs.autoplay = additionalFields.autoplay;

		const data = await infomaniakApiRequestGET<IntegrationCode>(
			context,
			`/1/videos/${accountId}/players/${player}/embed/code`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get player embed URL
	 * GET /1/videos/{account_id}/players/{player}/embed/url
	 */
	private static async getPlayerEmbedUrl(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const player = context.getNodeParameter('player', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = {};
		if (additionalFields.autoplay !== undefined) qs.autoplay = additionalFields.autoplay;

		const data = await infomaniakApiRequestGET<EmbedUrl>(
			context,
			`/1/videos/${accountId}/players/${player}/embed/url`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
