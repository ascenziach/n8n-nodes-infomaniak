/**
 * Team Resource Handler
 *
 * Handles operations for kChat Teams
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	kChatApiRequestGET,
	kChatApiRequestPOST,
	kChatApiRequestPUT,
	kChatApiRequestDELETE,
} from '../utils';
import { Team } from '../types';

export class TeamResource {
	/**
	 * Execute Team operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => TeamResource.create(context, itemIndex),
			get: () => TeamResource.get(context, itemIndex),
			getAll: () => TeamResource.getAll(context, itemIndex),
			update: () => TeamResource.update(context, itemIndex),
			delete: () => TeamResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a team
	 * POST /teams
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const name = context.getNodeParameter('name', itemIndex) as string;
		const displayName = context.getNodeParameter('displayName', itemIndex) as string;
		const type = context.getNodeParameter('type', itemIndex, 'O') as string;

		const body: Record<string, unknown> = {
			name,
			display_name: displayName,
			type,
		};

		const data = await kChatApiRequestPOST<Team>(
			context,
			'/teams',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get a team
	 * GET /teams/{team_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;

		const data = await kChatApiRequestGET<Team>(
			context,
			`/teams/${teamId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get all teams
	 * GET /teams
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const limit = context.getNodeParameter('limit', itemIndex, 60) as number;
		const page = context.getNodeParameter('page', itemIndex, 0) as number;

		const qs: Record<string, string | number | boolean | undefined> = {
			per_page: limit,
			page,
		};

		const data = await kChatApiRequestGET<Team[]>(
			context,
			'/teams',
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * Update a team
	 * PUT /teams/{team_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;
		const displayName = context.getNodeParameter('displayName', itemIndex, '') as string;
		const description = context.getNodeParameter('description', itemIndex, '') as string;

		const body: Record<string, unknown> = {
			id: teamId,
		};

		if (displayName) {
			body.display_name = displayName;
		}
		if (description) {
			body.description = description;
		}

		const data = await kChatApiRequestPUT<Team>(
			context,
			`/teams/${teamId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a team
	 * DELETE /teams/{team_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;

		await kChatApiRequestDELETE(
			context,
			`/teams/${teamId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			teamId,
			message: `Team ${teamId} deleted successfully`,
		} as IDataObject);
	}
}
