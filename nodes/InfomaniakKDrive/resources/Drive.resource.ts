/**
 * Drive Resource Handler
 *
 * Handles operations for kDrive Drives
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPUT,
	applyPagination,
} from '../utils';
import { Drive } from '../types';

export class DriveResource {
	/**
	 * Execute Drive operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => DriveResource.getAll(context, itemIndex),
			update: () => DriveResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get many drives
	 * GET /2/drive
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
			data: Drive[];
		}>(
			context,
			'/2/drive',
			qs,
			itemIndex,
		);

		const drives = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(drives as unknown as IDataObject[]);
	}

	/**
	 * Update a drive
	 * PUT /2/drive/{drive_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.name) {
			body.name = updateFields.name;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Drive;
		}>(
			context,
			`/2/drive/${driveId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
