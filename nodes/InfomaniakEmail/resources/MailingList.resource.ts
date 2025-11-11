/**
 * Mailing List Resource Handler
 *
 * Handles CRUD operations for Mailing Lists
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { MailingList } from '../types';

export class MailingListResource {
	/**
	 * Execute Mailing List operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => MailingListResource.getAll(context, itemIndex),
			get: () => MailingListResource.get(context, itemIndex),
			create: () => MailingListResource.create(context, itemIndex),
			update: () => MailingListResource.update(context, itemIndex),
			delete: () => MailingListResource.delete(context, itemIndex),
			send: () => MailingListResource.send(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all mailing lists
	 * GET /1/mail_hostings/{mail_hosting_id}/mailing_lists
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<MailingList[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailing_lists`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a mailing list
	 * GET /1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailingListId = context.getNodeParameter('mailingListId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<MailingList>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailing_lists/${mailingListId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a mailing list
	 * POST /1/mail_hostings/{mail_hosting_id}/mailing_lists
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailingListData = context.getNodeParameter('mailingListData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			name: mailingListData.name,
			email_address: mailingListData.email_address,
		};

		// Add optional fields
		if (mailingListData.description) body.description = mailingListData.description;
		if (mailingListData.is_moderated !== undefined) body.is_moderated = mailingListData.is_moderated;
		if (mailingListData.members) {
			// Parse members if provided as JSON string or array
			const membersData = mailingListData.members;
			if (typeof membersData === 'string') {
				body.members = JSON.parse(membersData);
			} else {
				body.members = membersData;
			}
		}

		const data = await infomaniakApiRequestPOST<MailingList>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailing_lists`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a mailing list
	 * PUT /1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailingListId = context.getNodeParameter('mailingListId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name !== undefined) body.name = updateData.name;
		if (updateData.description !== undefined) body.description = updateData.description;
		if (updateData.is_moderated !== undefined) body.is_moderated = updateData.is_moderated;
		if (updateData.members !== undefined) {
			// Parse members if provided as JSON string or array
			const membersData = updateData.members;
			if (typeof membersData === 'string') {
				body.members = JSON.parse(membersData);
			} else {
				body.members = membersData;
			}
		}

		const data = await infomaniakApiRequestPUT<MailingList>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailing_lists/${mailingListId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a mailing list
	 * DELETE /1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailingListId = context.getNodeParameter('mailingListId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/mail_hostings/${mailHostingId}/mailing_lists/${mailingListId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mailHostingId,
			mailingListId,
			message: `Mailing list ${mailingListId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Send email through mailing list
	 * POST /1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_id}/send
	 */
	private static async send(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailingListId = context.getNodeParameter('mailingListId', itemIndex) as string;
		const emailData = context.getNodeParameter('emailData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			subject: emailData.subject,
			message: emailData.message,
		};

		// Add optional fields
		if (emailData.reply_to) body.reply_to = emailData.reply_to;

		const data = await infomaniakApiRequestPOST<{ success: boolean; message_id: string }>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailing_lists/${mailingListId}/send`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
