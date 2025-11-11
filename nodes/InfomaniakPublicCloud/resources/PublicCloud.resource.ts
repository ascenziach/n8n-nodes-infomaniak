/**
 * PublicCloud Resource Handler
 *
 * Handles operations for Public Cloud management
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPUT,
	applyPagination,
} from '../utils';
import { PublicCloud, PublicCloudConfig, PublicCloudAccess } from '../types';

export class PublicCloudResource {
	/**
	 * Execute PublicCloud operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => PublicCloudResource.getAll(context, itemIndex),
			get: () => PublicCloudResource.get(context, itemIndex),
			update: () => PublicCloudResource.update(context, itemIndex),
			getAccesses: () => PublicCloudResource.getAccesses(context, itemIndex),
			getConfig: () => PublicCloudResource.getConfig(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all public clouds
	 * GET /1/public_clouds
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<PublicCloud[]>(
			context,
			'/1/public_clouds',
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single public cloud
	 * GET /1/public_clouds/{public_cloud_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<PublicCloud>(
			context,
			`/1/public_clouds/${publicCloudId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a public cloud
	 * PUT /1/public_clouds/{public_cloud_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name) body.name = updateData.name;
		if (updateData.description !== undefined) body.description = updateData.description;

		const data = await infomaniakApiRequestPUT<PublicCloud>(
			context,
			`/1/public_clouds/${publicCloudId}`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get accesses for a public cloud
	 * GET /1/public_clouds/{public_cloud_id}/accesses
	 */
	private static async getAccesses(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<PublicCloudAccess[]>(
			context,
			`/1/public_clouds/${publicCloudId}/accesses`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get configuration for a public cloud
	 * GET /1/public_clouds/{public_cloud_id}/config
	 */
	private static async getConfig(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<PublicCloudConfig>(
			context,
			`/1/public_clouds/${publicCloudId}/config`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
