/**
 * User Resource Handler
 *
 * Handles operations for OpenStack Users
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { User, UserAuthFile } from '../types';

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
			getAll: () => UserResource.getAll(context, itemIndex),
			get: () => UserResource.get(context, itemIndex),
			create: () => UserResource.create(context, itemIndex),
			createInvite: () => UserResource.createInvite(context, itemIndex),
			update: () => UserResource.update(context, itemIndex),
			updateWithInvite: () => UserResource.updateWithInvite(context, itemIndex),
			delete: () => UserResource.delete(context, itemIndex),
			getAuthFile: () => UserResource.getAuthFile(context, itemIndex),
			getOpenRC: () => UserResource.getOpenRC(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all users
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/users
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<User[]>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single user
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/users/{user_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userId = context.getNodeParameter('userId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<User>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users/${userId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a user
	 * POST /1/public_clouds/{public_cloud_id}/projects/{project_id}/users
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userData = context.getNodeParameter('userData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (userData.name) body.name = userData.name;
		if (userData.email) body.email = userData.email;
		if (userData.description !== undefined) body.description = userData.description;
		if (userData.password) body.password = userData.password;
		if (userData.enabled !== undefined) body.enabled = userData.enabled;
		if (userData.default_project_id) body.default_project_id = userData.default_project_id;

		const data = await infomaniakApiRequestPOST<User>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a user invitation
	 * POST /1/public_clouds/{public_cloud_id}/projects/{project_id}/users/invite
	 */
	private static async createInvite(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userData = context.getNodeParameter('userData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (userData.email) body.email = userData.email;
		if (userData.role) body.role = userData.role;
		if (userData.description !== undefined) body.description = userData.description;

		const data = await infomaniakApiRequestPOST<Record<string, unknown>>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users/invite`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as IDataObject);
	}

	/**
	 * Update a user
	 * PUT /1/public_clouds/{public_cloud_id}/projects/{project_id}/users/{user_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userId = context.getNodeParameter('userId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name) body.name = updateData.name;
		if (updateData.email) body.email = updateData.email;
		if (updateData.description !== undefined) body.description = updateData.description;
		if (updateData.password) body.password = updateData.password;
		if (updateData.enabled !== undefined) body.enabled = updateData.enabled;
		if (updateData.default_project_id) body.default_project_id = updateData.default_project_id;

		const data = await infomaniakApiRequestPUT<User>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users/${userId}`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a user and send invitation
	 * PUT /1/public_clouds/{public_cloud_id}/projects/{project_id}/users/{user_id}/invite
	 */
	private static async updateWithInvite(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userId = context.getNodeParameter('userId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.email) body.email = updateData.email;
		if (updateData.role) body.role = updateData.role;

		const data = await infomaniakApiRequestPUT<User>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users/${userId}/invite`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a user
	 * DELETE /1/public_clouds/{public_cloud_id}/projects/{project_id}/users/{user_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userId = context.getNodeParameter('userId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users/${userId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			userId,
			message: 'User deleted successfully',
		} as IDataObject);
	}

	/**
	 * Get authentication file (clouds.yaml)
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/users/{user_id}/auth-file
	 */
	private static async getAuthFile(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userId = context.getNodeParameter('userId', itemIndex) as string;
		const region = context.getNodeParameter('region', itemIndex, '') as string;

		const qs: Record<string, unknown> = {};
		if (region) qs.region = region;

		const data = await infomaniakApiRequestGET<UserAuthFile>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users/${userId}/auth-file`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get OpenRC file
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/users/{user_id}/openrc
	 */
	private static async getOpenRC(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const userId = context.getNodeParameter('userId', itemIndex) as string;
		const region = context.getNodeParameter('region', itemIndex, '') as string;

		const qs: Record<string, unknown> = {};
		if (region) qs.region = region;

		const data = await infomaniakApiRequestGET<UserAuthFile>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/users/${userId}/openrc`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
