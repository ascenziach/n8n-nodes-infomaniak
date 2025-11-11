/**
 * Alias Resource Handler
 *
 * Handles CRUD operations for Email Aliases
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Alias } from '../types';

export class AliasResource {
	/**
	 * Execute Alias operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => AliasResource.getAll(context, itemIndex),
			create: () => AliasResource.create(context, itemIndex),
			update: () => AliasResource.update(context, itemIndex),
			delete: () => AliasResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all aliases for a mailbox
	 * GET /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<Alias[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/aliases`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Create an alias
	 * POST /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const alias = context.getNodeParameter('alias', itemIndex) as string;

		const body: Record<string, unknown> = {
			alias,
		};

		const data = await infomaniakApiRequestPOST<Alias>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/aliases`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update all aliases for a mailbox
	 * PUT /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const aliases = context.getNodeParameter('aliases', itemIndex) as string;

		// Convert comma-separated string to array
		const aliasArray = aliases.split(',').map(a => a.trim()).filter(a => a);

		const body: Record<string, unknown> = {
			aliases: aliasArray,
		};

		const data = await infomaniakApiRequestPUT<Alias[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/aliases`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * Delete an alias
	 * DELETE /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases/{alias}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const alias = context.getNodeParameter('alias', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/aliases/${alias}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mailHostingId,
			mailboxName,
			alias,
			message: `Alias ${alias} deleted successfully`,
		} as IDataObject);
	}
}
