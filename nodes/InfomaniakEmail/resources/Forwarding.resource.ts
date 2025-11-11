/**
 * Forwarding Resource Handler
 *
 * Handles CRUD operations for Email Forwarding
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { ForwardingAddress } from '../types';

export class ForwardingResource {
	/**
	 * Execute Forwarding operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => ForwardingResource.getAll(context, itemIndex),
			create: () => ForwardingResource.create(context, itemIndex),
			update: () => ForwardingResource.update(context, itemIndex),
			deleteAll: () => ForwardingResource.deleteAll(context, itemIndex),
			delete: () => ForwardingResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all forwarding addresses for a mailbox
	 * GET /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<ForwardingAddress[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/forwarding`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Create a forwarding address
	 * POST /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const forwardingData = context.getNodeParameter('forwardingData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			forwarding_address: forwardingData.forwarding_address,
			keep_copy: forwardingData.keep_copy ?? false,
		};

		// Add optional fields
		if (forwardingData.is_enabled !== undefined) body.is_enabled = forwardingData.is_enabled;

		const data = await infomaniakApiRequestPOST<ForwardingAddress>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/forwarding`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update forwarding configuration
	 * PUT /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.forwarding_addresses !== undefined) {
			// Convert comma-separated string to array
			const addressesStr = updateData.forwarding_addresses as string;
			body.forwarding_addresses = addressesStr.split(',').map(a => a.trim()).filter(a => a);
		}
		if (updateData.keep_copy !== undefined) body.keep_copy = updateData.keep_copy;
		if (updateData.is_enabled !== undefined) body.is_enabled = updateData.is_enabled;

		const data = await infomaniakApiRequestPUT<ForwardingAddress[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/forwarding`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * Delete all forwarding addresses
	 * DELETE /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding
	 */
	private static async deleteAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/forwarding`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mailHostingId,
			mailboxName,
			message: `All forwarding addresses for ${mailboxName} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Delete a specific forwarding address
	 * DELETE /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding/{forwarding_address}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const forwardingAddress = context.getNodeParameter('forwardingAddress', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/forwarding/${encodeURIComponent(forwardingAddress)}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mailHostingId,
			mailboxName,
			forwardingAddress,
			message: `Forwarding address ${forwardingAddress} deleted successfully`,
		} as IDataObject);
	}
}
