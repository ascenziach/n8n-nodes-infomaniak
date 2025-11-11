/**
 * Kubernetes Resource Handler
 *
 * Handles operations for Kubernetes Services including instance pools
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import {
	KubernetesService,
	KubernetesInstancePool,
	KubernetesConfig,
	KubernetesVersion,
	KubernetesPack,
	AvailabilityZone,
	Region,
	Flavor,
} from '../types';

export class KubernetesResource {
	/**
	 * Execute Kubernetes operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => KubernetesResource.getAll(context, itemIndex),
			getAllForAccount: () => KubernetesResource.getAllForAccount(context, itemIndex),
			get: () => KubernetesResource.get(context, itemIndex),
			create: () => KubernetesResource.create(context, itemIndex),
			update: () => KubernetesResource.update(context, itemIndex),
			delete: () => KubernetesResource.delete(context, itemIndex),
			getKubeConfig: () => KubernetesResource.getKubeConfig(context, itemIndex),
			listInstancePools: () => KubernetesResource.listInstancePools(context, itemIndex),
			getInstancePool: () => KubernetesResource.getInstancePool(context, itemIndex),
			createInstancePool: () => KubernetesResource.createInstancePool(context, itemIndex),
			updateInstancePool: () => KubernetesResource.updateInstancePool(context, itemIndex),
			deleteInstancePool: () => KubernetesResource.deleteInstancePool(context, itemIndex),
			listAvailabilityZones: () => KubernetesResource.listAvailabilityZones(context, itemIndex),
			listPacks: () => KubernetesResource.listPacks(context, itemIndex),
			listRegions: () => KubernetesResource.listRegions(context, itemIndex),
			listVersions: () => KubernetesResource.listVersions(context, itemIndex),
			listFlavors: () => KubernetesResource.listFlavors(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all kubernetes services for a project
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<KubernetesService[]>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get all kubernetes services for account
	 * GET /1/accounts/{account_id}/kubernetes
	 */
	private static async getAllForAccount(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<KubernetesService[]>(
			context,
			`/1/accounts/${accountId}/kubernetes`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single kubernetes service
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<KubernetesService>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a kubernetes service
	 * POST /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesData = context.getNodeParameter('kubernetesData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (kubernetesData.name) body.name = kubernetesData.name;
		if (kubernetesData.version) body.version = kubernetesData.version;
		if (kubernetesData.region) body.region = kubernetesData.region;

		const data = await infomaniakApiRequestPOST<KubernetesService>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a kubernetes service
	 * PUT /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name) body.name = updateData.name;
		if (updateData.version) body.version = updateData.version;

		const data = await infomaniakApiRequestPUT<KubernetesService>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a kubernetes service
	 * DELETE /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			kubernetesId,
			message: 'Kubernetes service deleted successfully',
		} as IDataObject);
	}

	/**
	 * Get kubeconfig file
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}/kubeconfig
	 */
	private static async getKubeConfig(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<KubernetesConfig>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}/kubeconfig`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * List instance pools (worker pools)
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}/instance-pools
	 */
	private static async listInstancePools(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<KubernetesInstancePool[]>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}/instance-pools`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get an instance pool
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}/instance-pools/{pool_id}
	 */
	private static async getInstancePool(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;
		const poolId = context.getNodeParameter('poolId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<KubernetesInstancePool>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}/instance-pools/${poolId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create an instance pool
	 * POST /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}/instance-pools
	 */
	private static async createInstancePool(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;
		const poolData = context.getNodeParameter('poolData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (poolData.name) body.name = poolData.name;
		if (poolData.flavor) body.flavor = poolData.flavor;
		if (poolData.size !== undefined) body.size = poolData.size;
		if (poolData.min_size !== undefined) body.min_size = poolData.min_size;
		if (poolData.max_size !== undefined) body.max_size = poolData.max_size;
		if (poolData.autoscaling_enabled !== undefined) body.autoscaling_enabled = poolData.autoscaling_enabled;
		if (poolData.availability_zone) body.availability_zone = poolData.availability_zone;

		const data = await infomaniakApiRequestPOST<KubernetesInstancePool>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}/instance-pools`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update an instance pool
	 * PUT /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}/instance-pools/{pool_id}
	 */
	private static async updateInstancePool(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;
		const poolId = context.getNodeParameter('poolId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name) body.name = updateData.name;
		if (updateData.size !== undefined) body.size = updateData.size;
		if (updateData.min_size !== undefined) body.min_size = updateData.min_size;
		if (updateData.max_size !== undefined) body.max_size = updateData.max_size;
		if (updateData.autoscaling_enabled !== undefined) body.autoscaling_enabled = updateData.autoscaling_enabled;

		const data = await infomaniakApiRequestPUT<KubernetesInstancePool>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}/instance-pools/${poolId}`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete an instance pool
	 * DELETE /1/public_clouds/{public_cloud_id}/projects/{project_id}/kubernetes/{kubernetes_id}/instance-pools/{pool_id}
	 */
	private static async deleteInstancePool(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const kubernetesId = context.getNodeParameter('kubernetesId', itemIndex) as string;
		const poolId = context.getNodeParameter('poolId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/kubernetes/${kubernetesId}/instance-pools/${poolId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			poolId,
			message: 'Instance pool deleted successfully',
		} as IDataObject);
	}

	/**
	 * List availability zones
	 * GET /1/public_clouds/{public_cloud_id}/kubernetes/availability-zones
	 */
	private static async listAvailabilityZones(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const region = context.getNodeParameter('region', itemIndex, '') as string;

		const qs: Record<string, unknown> = {};
		if (region) qs.region = region;

		const data = await infomaniakApiRequestGET<AvailabilityZone[]>(
			context,
			`/1/public_clouds/${publicCloudId}/kubernetes/availability-zones`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * List kubernetes packs
	 * GET /1/public_clouds/{public_cloud_id}/kubernetes/packs
	 */
	private static async listPacks(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<KubernetesPack[]>(
			context,
			`/1/public_clouds/${publicCloudId}/kubernetes/packs`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * List kubernetes regions
	 * GET /1/public_clouds/{public_cloud_id}/kubernetes/regions
	 */
	private static async listRegions(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Region[]>(
			context,
			`/1/public_clouds/${publicCloudId}/kubernetes/regions`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * List kubernetes versions
	 * GET /1/public_clouds/{public_cloud_id}/kubernetes/versions
	 */
	private static async listVersions(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<KubernetesVersion[]>(
			context,
			`/1/public_clouds/${publicCloudId}/kubernetes/versions`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * List kubernetes flavors
	 * GET /1/public_clouds/{public_cloud_id}/kubernetes/flavors
	 */
	private static async listFlavors(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Flavor[]>(
			context,
			`/1/public_clouds/${publicCloudId}/kubernetes/flavors`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}
}
