/**
 * Channel Resource Handler
 *
 * Handles operations for kChat Channels
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	kChatApiRequestGET,
	kChatApiRequestPOST,
	kChatApiRequestPUT,
	kChatApiRequestDELETE,
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
			create: () => ChannelResource.create(context, itemIndex),
			get: () => ChannelResource.get(context, itemIndex),
			getAll: () => ChannelResource.getAll(context, itemIndex),
			update: () => ChannelResource.update(context, itemIndex),
			delete: () => ChannelResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a channel
	 * POST /channels
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;
		const name = context.getNodeParameter('name', itemIndex) as string;
		const displayName = context.getNodeParameter('displayName', itemIndex) as string;
		const type = context.getNodeParameter('type', itemIndex, 'O') as string;
		const purpose = context.getNodeParameter('purpose', itemIndex, '') as string;
		const header = context.getNodeParameter('header', itemIndex, '') as string;

		const body: Record<string, unknown> = {
			team_id: teamId,
			name,
			display_name: displayName,
			type,
		};

		if (purpose) {
			body.purpose = purpose;
		}
		if (header) {
			body.header = header;
		}

		const data = await kChatApiRequestPOST<Channel>(
			context,
			'/channels',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get a channel
	 * GET /channels/{channel_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;

		const data = await kChatApiRequestGET<Channel>(
			context,
			`/channels/${channelId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channels for a team
	 * GET /teams/{team_id}/channels
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;
		const limit = context.getNodeParameter('limit', itemIndex, 60) as number;
		const page = context.getNodeParameter('page', itemIndex, 0) as number;

		const qs: Record<string, string | number | boolean | undefined> = {
			per_page: limit,
			page,
		};

		const data = await kChatApiRequestGET<Channel[]>(
			context,
			`/teams/${teamId}/channels`,
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * Update a channel
	 * PUT /channels/{channel_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const displayName = context.getNodeParameter('displayName', itemIndex, '') as string;
		const purpose = context.getNodeParameter('purpose', itemIndex, '') as string;
		const header = context.getNodeParameter('header', itemIndex, '') as string;

		const body: Record<string, unknown> = {
			id: channelId,
		};

		if (displayName) {
			body.display_name = displayName;
		}
		if (purpose) {
			body.purpose = purpose;
		}
		if (header) {
			body.header = header;
		}

		const data = await kChatApiRequestPUT<Channel>(
			context,
			`/channels/${channelId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a channel
	 * DELETE /channels/{channel_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;

		await kChatApiRequestDELETE(
			context,
			`/channels/${channelId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			channelId,
			message: `Channel ${channelId} deleted successfully`,
		} as IDataObject);
	}
}
