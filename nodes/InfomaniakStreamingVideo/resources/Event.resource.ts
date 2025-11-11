/**
 * Event Resource Handler
 *
 * Handles operations related to repeatable planned events
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { RepeatablePlannedEvent } from '../types';

export class EventResource {
	/**
	 * Execute Event operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => EventResource.getAll(context, itemIndex),
			get: () => EventResource.get(context, itemIndex),
			create: () => EventResource.create(context, itemIndex),
			update: () => EventResource.update(context, itemIndex),
			delete: () => EventResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all events for a channel
	 * GET /1/videos/{account_id}/channels/{channel}/events
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<RepeatablePlannedEvent[]>(
			context,
			`/1/videos/${accountId}/channels/${channel}/events`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single event
	 * GET /1/videos/{account_id}/channels/{channel}/events/{event}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const event = context.getNodeParameter('event', itemIndex) as string;

		const data = await infomaniakApiRequestGET<RepeatablePlannedEvent>(
			context,
			`/1/videos/${accountId}/channels/${channel}/events/${event}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create an event
	 * POST /1/videos/{account_id}/channels/{channel}/events
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const name = context.getNodeParameter('name', itemIndex) as string;
		const startTime = context.getNodeParameter('startTime', itemIndex) as string;
		const endTime = context.getNodeParameter('endTime', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			name,
			start_time: startTime,
			end_time: endTime,
		};

		if (additionalFields.description) body.description = additionalFields.description;
		if (additionalFields.repeatPattern) body.repeat_pattern = additionalFields.repeatPattern;

		const data = await infomaniakApiRequestPOST<RepeatablePlannedEvent>(
			context,
			`/1/videos/${accountId}/channels/${channel}/events`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update an event
	 * PUT /1/videos/{account_id}/channels/{channel}/events/{event}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const event = context.getNodeParameter('event', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.startTime) body.start_time = updateFields.startTime;
		if (updateFields.endTime) body.end_time = updateFields.endTime;
		if (updateFields.repeatPattern) body.repeat_pattern = updateFields.repeatPattern;

		const data = await infomaniakApiRequestPUT<RepeatablePlannedEvent>(
			context,
			`/1/videos/${accountId}/channels/${channel}/events/${event}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete an event
	 * DELETE /1/videos/{account_id}/channels/{channel}/events/{event}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const event = context.getNodeParameter('event', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/videos/${accountId}/channels/${channel}/events/${event}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			accountId,
			channel,
			event,
			message: `Event ${event} deleted successfully`,
		} as IDataObject);
	}
}
