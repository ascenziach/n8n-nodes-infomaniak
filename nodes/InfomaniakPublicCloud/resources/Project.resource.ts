/**
 * Project Resource Handler
 *
 * Handles operations for OpenStack Projects
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Project } from '../types';

export class ProjectResource {
	/**
	 * Execute Project operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => ProjectResource.getAll(context, itemIndex),
			get: () => ProjectResource.get(context, itemIndex),
			create: () => ProjectResource.create(context, itemIndex),
			createWithInvite: () => ProjectResource.createWithInvite(context, itemIndex),
			update: () => ProjectResource.update(context, itemIndex),
			delete: () => ProjectResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all projects
	 * GET /1/public_clouds/{public_cloud_id}/projects
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<Project[]>(
			context,
			`/1/public_clouds/${publicCloudId}/projects`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single project
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Project>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a project
	 * POST /1/public_clouds/{public_cloud_id}/projects
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectData = context.getNodeParameter('projectData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (projectData.name) body.name = projectData.name;
		if (projectData.description !== undefined) body.description = projectData.description;
		if (projectData.enabled !== undefined) body.enabled = projectData.enabled;
		if (projectData.domain_id) body.domain_id = projectData.domain_id;
		if (projectData.parent_id) body.parent_id = projectData.parent_id;

		const data = await infomaniakApiRequestPOST<Project>(
			context,
			`/1/public_clouds/${publicCloudId}/projects`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a project with invitation
	 * POST /1/public_clouds/{public_cloud_id}/projects/invite
	 */
	private static async createWithInvite(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectData = context.getNodeParameter('projectData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (projectData.name) body.name = projectData.name;
		if (projectData.description !== undefined) body.description = projectData.description;
		if (projectData.email) body.email = projectData.email;
		if (projectData.role) body.role = projectData.role;

		const data = await infomaniakApiRequestPOST<Project>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/invite`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a project
	 * PUT /1/public_clouds/{public_cloud_id}/projects/{project_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name) body.name = updateData.name;
		if (updateData.description !== undefined) body.description = updateData.description;
		if (updateData.enabled !== undefined) body.enabled = updateData.enabled;

		const data = await infomaniakApiRequestPUT<Project>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a project
	 * DELETE /1/public_clouds/{public_cloud_id}/projects/{project_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			projectId,
			message: 'Project deleted successfully',
		} as IDataObject);
	}
}
