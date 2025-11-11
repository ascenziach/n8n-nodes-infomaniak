/**
 * Auto Reply Resource Handler
 *
 * Handles CRUD operations for Auto Replies
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { AutoReply } from '../types';

export class AutoReplyResource {
	/**
	 * Execute Auto Reply operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => AutoReplyResource.getAll(context, itemIndex),
			get: () => AutoReplyResource.get(context, itemIndex),
			create: () => AutoReplyResource.create(context, itemIndex),
			update: () => AutoReplyResource.update(context, itemIndex),
			delete: () => AutoReplyResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all auto replies (service level)
	 * GET /1/mail_hostings/{mail_hosting_id}/auto_replies
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<AutoReply[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/auto_replies`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get an auto reply
	 * GET /1/mail_hostings/{mail_hosting_id}/auto_replies/{auto_reply_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const autoReplyId = context.getNodeParameter('autoReplyId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<AutoReply>(
			context,
			`/1/mail_hostings/${mailHostingId}/auto_replies/${autoReplyId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create an auto reply
	 * POST /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const autoReplyData = context.getNodeParameter('autoReplyData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			subject: autoReplyData.subject,
			message: autoReplyData.message,
			is_enabled: autoReplyData.is_enabled ?? true,
		};

		// Add optional fields
		if (autoReplyData.start_date) body.start_date = autoReplyData.start_date;
		if (autoReplyData.end_date) body.end_date = autoReplyData.end_date;

		const data = await infomaniakApiRequestPOST<AutoReply>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/auto_reply`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update an auto reply
	 * PUT /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.subject !== undefined) body.subject = updateData.subject;
		if (updateData.message !== undefined) body.message = updateData.message;
		if (updateData.is_enabled !== undefined) body.is_enabled = updateData.is_enabled;
		if (updateData.start_date !== undefined) body.start_date = updateData.start_date;
		if (updateData.end_date !== undefined) body.end_date = updateData.end_date;

		const data = await infomaniakApiRequestPUT<AutoReply>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/auto_reply`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete an auto reply
	 * DELETE /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/auto_reply`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mailHostingId,
			mailboxName,
			message: `Auto reply for ${mailboxName} deleted successfully`,
		} as IDataObject);
	}
}
