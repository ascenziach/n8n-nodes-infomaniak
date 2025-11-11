/**
 * Storage Resource Handler
 *
 * Handles operations related to storage machines
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { StorageMachine } from '../types';

export class StorageResource {
	/**
	 * Execute Storage operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => StorageResource.getAll(context, itemIndex),
			get: () => StorageResource.get(context, itemIndex),
			create: () => StorageResource.create(context, itemIndex),
			update: () => StorageResource.update(context, itemIndex),
			delete: () => StorageResource.delete(context, itemIndex),
			test: () => StorageResource.test(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all storage machines
	 * GET /1/videos/{account_id}/storage
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<StorageMachine[]>(
			context,
			`/1/videos/${accountId}/storage`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single storage machine
	 * GET /1/videos/{account_id}/storage/{storage}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const storage = context.getNodeParameter('storage', itemIndex) as string;

		const data = await infomaniakApiRequestGET<StorageMachine>(
			context,
			`/1/videos/${accountId}/storage/${storage}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a storage machine
	 * POST /1/videos/{account_id}/storage
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const name = context.getNodeParameter('name', itemIndex) as string;
		const type = context.getNodeParameter('type', itemIndex) as string;
		const host = context.getNodeParameter('host', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			name,
			type,
			host,
		};

		if (additionalFields.port) body.port = additionalFields.port;
		if (additionalFields.username) body.username = additionalFields.username;
		if (additionalFields.password) body.password = additionalFields.password;
		if (additionalFields.path) body.path = additionalFields.path;

		const data = await infomaniakApiRequestPOST<StorageMachine>(
			context,
			`/1/videos/${accountId}/storage`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a storage machine
	 * PUT /1/videos/{account_id}/storage/{storage}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const storage = context.getNodeParameter('storage', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.host) body.host = updateFields.host;
		if (updateFields.port !== undefined) body.port = updateFields.port;
		if (updateFields.username !== undefined) body.username = updateFields.username;
		if (updateFields.password !== undefined) body.password = updateFields.password;
		if (updateFields.path !== undefined) body.path = updateFields.path;

		const data = await infomaniakApiRequestPUT<StorageMachine>(
			context,
			`/1/videos/${accountId}/storage/${storage}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a storage machine
	 * DELETE /1/videos/{account_id}/storage/{storage}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const storage = context.getNodeParameter('storage', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/videos/${accountId}/storage/${storage}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			accountId,
			storage,
			message: `Storage machine ${storage} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Test storage connection
	 * POST /1/videos/{account_id}/storage/{storage}/test
	 */
	private static async test(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const storage = context.getNodeParameter('storage', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<{ success: boolean; message: string }>(
			context,
			`/1/videos/${accountId}/storage/${storage}/test`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
