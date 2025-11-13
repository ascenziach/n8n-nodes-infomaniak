/**
 * User Resource Handler
 *
 * Handles operations for kDrive Users
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { User } from '../types';

export class UserResource {
	/**
	 * Execute User operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => UserResource.create(context, itemIndex),
			delete: () => UserResource.delete(context, itemIndex),
			get: () => UserResource.get(context, itemIndex),
			getAll: () => UserResource.getAll(context, itemIndex),
			update: () => UserResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a user
	 * POST /2/drive/{drive_id}/users
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const email = context.getNodeParameter('email', itemIndex) as string;
		const role = context.getNodeParameter('role', itemIndex) as string;

		const body: Record<string, unknown> = {
			email,
			role,
		};

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: User;
		}>(
			context,
			`/2/drive/${driveId}/users`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a user
	 * DELETE /2/drive/{drive_id}/users/{user_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const userId = context.getNodeParameter('userId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/2/drive/${driveId}/users/${userId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			userId,
			message: `User ${userId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a user
	 * GET /2/drive/{drive_id}/users/{user_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const userId = context.getNodeParameter('userId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: User;
		}>(
			context,
			`/2/drive/${driveId}/users/${userId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many users
	 * GET /2/drive/{drive_id}/users
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: User[];
		}>(
			context,
			`/2/drive/${driveId}/users`,
			qs,
			itemIndex,
		);

		const users = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(users as unknown as IDataObject[]);
	}

	/**
	 * Update a user
	 * PUT /2/drive/{drive_id}/users/{user_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const userId = context.getNodeParameter('userId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.role) {
			body.role = updateFields.role;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: User;
		}>(
			context,
			`/2/drive/${driveId}/users/${userId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
