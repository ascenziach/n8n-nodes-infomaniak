/**
 * Slot Resource Handler
 *
 * Handles operations for Swiss Backup Slots
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Slot } from '../types';

export class SlotResource {
	/**
	 * Execute Slot operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => SlotResource.create(context, itemIndex),
			delete: () => SlotResource.delete(context, itemIndex),
			disable: () => SlotResource.disable(context, itemIndex),
			enable: () => SlotResource.enable(context, itemIndex),
			get: () => SlotResource.get(context, itemIndex),
			getAll: () => SlotResource.getAll(context, itemIndex),
			requestPassword: () => SlotResource.requestPassword(context, itemIndex),
			update: () => SlotResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a slot
	 * POST /1/swiss_backups/{swiss_backup_id}/slots
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const customerName = context.getNodeParameter('customer_name', itemIndex) as string;
		const email = context.getNodeParameter('email', itemIndex) as string;
		const size = context.getNodeParameter('size', itemIndex) as number;
		const type = context.getNodeParameter('type', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {
			customer_name: customerName,
			email,
			size,
			type,
		};

		if (additionalFields.connection_type) {
			body.connection_type = additionalFields.connection_type;
		}

		if (additionalFields.firstname) {
			body.firstname = additionalFields.firstname;
		}

		if (additionalFields.lastname) {
			body.lastname = additionalFields.lastname;
		}

		if (additionalFields.lang) {
			body.lang = additionalFields.lang;
		}

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Slot;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}/slots`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a slot
	 * DELETE /1/swiss_backups/{swiss_backup_id}/slots/{slot_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const slotId = context.getNodeParameter('slotId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/1/swiss_backups/${swissBackupId}/slots/${slotId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			slotId,
			message: `Slot ${slotId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Disable a slot
	 * POST /1/swiss_backups/{swiss_backup_id}/slots/{slot_id}/disable
	 */
	private static async disable(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const slotId = context.getNodeParameter('slotId', itemIndex) as number;

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Slot;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}/slots/${slotId}/disable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Enable a slot
	 * POST /1/swiss_backups/{swiss_backup_id}/slots/{slot_id}/enable
	 */
	private static async enable(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const slotId = context.getNodeParameter('slotId', itemIndex) as number;

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Slot;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}/slots/${slotId}/enable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get a slot
	 * GET /1/swiss_backups/{swiss_backup_id}/slots/{slot_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const slotId = context.getNodeParameter('slotId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Slot;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}/slots/${slotId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many slots
	 * GET /1/swiss_backups/{swiss_backup_id}/slots
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Slot[];
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}/slots`,
			qs,
			itemIndex,
		);

		const slots = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(slots as unknown as IDataObject[]);
	}

	/**
	 * Request password for a slot
	 * POST /1/swiss_backups/{swiss_backup_id}/slots/{slot_id}/request_password
	 */
	private static async requestPassword(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const slotId = context.getNodeParameter('slotId', itemIndex) as number;

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: unknown;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}/slots/${slotId}/request_password`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: 'Password request sent successfully',
			...(response.data as IDataObject),
		} as IDataObject);
	}

	/**
	 * Update a slot
	 * PUT /1/swiss_backups/{swiss_backup_id}/slots/{slot_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const swissBackupId = context.getNodeParameter('swissBackupId', itemIndex) as number;
		const slotId = context.getNodeParameter('slotId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.customer_name) {
			body.customer_name = updateFields.customer_name;
		}

		if (updateFields.email) {
			body.email = updateFields.email;
		}

		if (updateFields.size !== undefined) {
			body.size = updateFields.size;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Slot;
		}>(
			context,
			`/1/swiss_backups/${swissBackupId}/slots/${slotId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
