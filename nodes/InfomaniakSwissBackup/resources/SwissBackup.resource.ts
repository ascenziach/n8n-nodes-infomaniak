/**
 * SwissBackup Resource Handler
 *
 * Handles operations for Swiss Backup products
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPUT,
	applyPagination,
} from '../utils';
import { SwissBackup } from '../types';

export class SwissBackupResource {
	/**
	 * Execute SwissBackup operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			get: () => SwissBackupResource.get(context, itemIndex),
			getAll: () => SwissBackupResource.getAll(context, itemIndex),
			update: () => SwissBackupResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get a Swiss Backup
	 * GET /1/swiss_backups/{swiss_backup_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: SwissBackup;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many Swiss Backups
	 * GET /1/swiss_backups
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: SwissBackup[];
		}>(
			context,
			'/1/swiss_backups',
			qs,
			itemIndex,
		);

		const swissBackups = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(swissBackups as unknown as IDataObject[]);
	}

	/**
	 * Update a Swiss Backup
	 * PUT /1/swiss_backups/{swiss_backup_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.periodicity) {
			body.periodicity = updateFields.periodicity;
		}

		if (updateFields.storage_reserved_acronis !== undefined) {
			body.storage_reserved_acronis = updateFields.storage_reserved_acronis;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: SwissBackup;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
