/**
 * Event Resource Handler
 *
 * Handles operations related to Infomaniak Events
 */

import { IExecuteFunctions, INodeExecutionData , IDataObject } from 'n8n-workflow';
import { infomaniakApiRequestGET, buildQueryString, applyPagination } from '../utils';
import { Event, PublicCloudStatus } from '../types';

export class EventResource {
	/**
	 * Execute Event operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'getAll') {
			return await EventResource.getAll(context, itemIndex);
		} else if (operation === 'get') {
			return await EventResource.get(context, itemIndex);
		} else if (operation === 'getPublicCloudStatus') {
			return await EventResource.getPublicCloudStatus(context, itemIndex);
		}

		return [];
	}

	/**
	 * Get all events
	 * GET /events
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const search = context.getNodeParameter('search', itemIndex, '') as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Build query string
		const qs = buildQueryString({
			...(search && { search }),
		});

		// Make API request
		const data = await infomaniakApiRequestGET<Event[]>(
			context,
			'/events',
			qs,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		// Return as n8n data
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single event by ID
	 * GET /events/{event_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const eventId = context.getNodeParameter('eventId', itemIndex) as number;

		// Make API request
		const data = await infomaniakApiRequestGET<Event>(
			context,
			`/events/${eventId}`,
			undefined,
			itemIndex,
		);

		// Return as n8n data
		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get public cloud status
	 * GET /public_cloud_status
	 */
	private static async getPublicCloudStatus(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		// Make API request
		const data = await infomaniakApiRequestGET<PublicCloudStatus>(
			context,
			'/public_cloud_status',
			undefined,
			itemIndex,
		);

		// Return as n8n data
		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
