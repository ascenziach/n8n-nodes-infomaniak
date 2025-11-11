/**
 * Mailbox Resource Handler
 *
 * Handles operations for Mailboxes
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	applyPagination,
} from '../utils';
import { Mailbox } from '../types';

export class MailboxResource {
	/**
	 * Execute Mailbox operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => MailboxResource.getAll(context, itemIndex),
			get: () => MailboxResource.get(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all mailboxes
	 * GET /1/mail_hostings/{mail_hosting_id}/mailboxes
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
		const filters = context.getNodeParameter('filters', itemIndex, {}) as Record<string, unknown>;

		// Build query string for filtering
		const qs: Record<string, unknown> = {};
		if (filters.search) qs.search = filters.search;
		if (filters.is_locked !== undefined) qs.is_locked = filters.is_locked;

		const data = await infomaniakApiRequestGET<Mailbox[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes`,
			qs as any,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single mailbox
	 * GET /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Mailbox>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
