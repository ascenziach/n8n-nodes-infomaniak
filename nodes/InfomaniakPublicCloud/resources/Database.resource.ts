/**
 * Database Resource Handler
 *
 * Handles operations for Database Services including backups and restores
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
	DatabaseService,
	DatabaseBackup,
	DatabaseRestore,
	DatabasePack,
	DatabaseType,
	DatabasePassword,
	Region,
} from '../types';

export class DatabaseResource {
	/**
	 * Execute Database operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => DatabaseResource.getAll(context, itemIndex),
			getAllForAccount: () => DatabaseResource.getAllForAccount(context, itemIndex),
			get: () => DatabaseResource.get(context, itemIndex),
			create: () => DatabaseResource.create(context, itemIndex),
			update: () => DatabaseResource.update(context, itemIndex),
			delete: () => DatabaseResource.delete(context, itemIndex),
			getPassword: () => DatabaseResource.getPassword(context, itemIndex),
			listBackups: () => DatabaseResource.listBackups(context, itemIndex),
			getBackup: () => DatabaseResource.getBackup(context, itemIndex),
			createBackup: () => DatabaseResource.createBackup(context, itemIndex),
			deleteBackup: () => DatabaseResource.deleteBackup(context, itemIndex),
			listRestores: () => DatabaseResource.listRestores(context, itemIndex),
			getRestore: () => DatabaseResource.getRestore(context, itemIndex),
			createRestore: () => DatabaseResource.createRestore(context, itemIndex),
			deleteRestore: () => DatabaseResource.deleteRestore(context, itemIndex),
			listPacks: () => DatabaseResource.listPacks(context, itemIndex),
			listRegions: () => DatabaseResource.listRegions(context, itemIndex),
			listTypes: () => DatabaseResource.listTypes(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all database services for a project
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<DatabaseService[]>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get all database services for account
	 * GET /1/accounts/{account_id}/databases
	 */
	private static async getAllForAccount(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<DatabaseService[]>(
			context,
			`/1/accounts/${accountId}/databases`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single database service
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DatabaseService>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a database service
	 * POST /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseData = context.getNodeParameter('databaseData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (databaseData.name) body.name = databaseData.name;
		if (databaseData.type) body.type = databaseData.type;
		if (databaseData.version) body.version = databaseData.version;
		if (databaseData.region) body.region = databaseData.region;
		if (databaseData.pack) body.pack = databaseData.pack;
		if (databaseData.flavor) body.flavor = databaseData.flavor;
		if (databaseData.storage_size) body.storage_size = databaseData.storage_size;
		if (databaseData.password) body.password = databaseData.password;

		const data = await infomaniakApiRequestPOST<DatabaseService>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a database service
	 * PUT /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name) body.name = updateData.name;
		if (updateData.pack) body.pack = updateData.pack;
		if (updateData.storage_size) body.storage_size = updateData.storage_size;

		const data = await infomaniakApiRequestPUT<DatabaseService>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a database service
	 * DELETE /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			databaseId,
			message: 'Database service deleted successfully',
		} as IDataObject);
	}

	/**
	 * Get database password/connection info
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/password
	 */
	private static async getPassword(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DatabasePassword>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/password`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * List database backups
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/backups
	 */
	private static async listBackups(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<DatabaseBackup[]>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/backups`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a database backup
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/backups/{backup_id}
	 */
	private static async getBackup(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const backupId = context.getNodeParameter('backupId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DatabaseBackup>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/backups/${backupId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a database backup
	 * POST /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/backups
	 */
	private static async createBackup(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const backupData = context.getNodeParameter('backupData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (backupData.name) body.name = backupData.name;
		if (backupData.description !== undefined) body.description = backupData.description;

		const data = await infomaniakApiRequestPOST<DatabaseBackup>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/backups`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a database backup
	 * DELETE /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/backups/{backup_id}
	 */
	private static async deleteBackup(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const backupId = context.getNodeParameter('backupId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/backups/${backupId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			backupId,
			message: 'Database backup deleted successfully',
		} as IDataObject);
	}

	/**
	 * List database restores
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/restores
	 */
	private static async listRestores(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<DatabaseRestore[]>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/restores`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a database restore
	 * GET /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/restores/{restore_id}
	 */
	private static async getRestore(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const restoreId = context.getNodeParameter('restoreId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DatabaseRestore>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/restores/${restoreId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a database restore from backup
	 * POST /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/restores
	 */
	private static async createRestore(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const restoreData = context.getNodeParameter('restoreData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (restoreData.backup_id) body.backup_id = restoreData.backup_id;

		const data = await infomaniakApiRequestPOST<DatabaseRestore>(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/restores`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a database restore
	 * DELETE /1/public_clouds/{public_cloud_id}/projects/{project_id}/databases/{database_id}/restores/{restore_id}
	 */
	private static async deleteRestore(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;
		const projectId = context.getNodeParameter('projectId', itemIndex) as string;
		const databaseId = context.getNodeParameter('databaseId', itemIndex) as string;
		const restoreId = context.getNodeParameter('restoreId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/public_clouds/${publicCloudId}/projects/${projectId}/databases/${databaseId}/restores/${restoreId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			restoreId,
			message: 'Database restore deleted successfully',
		} as IDataObject);
	}

	/**
	 * List available database packs
	 * GET /1/public_clouds/{public_cloud_id}/databases/packs
	 */
	private static async listPacks(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DatabasePack[]>(
			context,
			`/1/public_clouds/${publicCloudId}/databases/packs`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * List available database regions
	 * GET /1/public_clouds/{public_cloud_id}/databases/regions
	 */
	private static async listRegions(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Region[]>(
			context,
			`/1/public_clouds/${publicCloudId}/databases/regions`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * List available database types
	 * GET /1/public_clouds/{public_cloud_id}/databases/types
	 */
	private static async listTypes(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const publicCloudId = context.getNodeParameter('publicCloudId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DatabaseType[]>(
			context,
			`/1/public_clouds/${publicCloudId}/databases/types`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}
}
