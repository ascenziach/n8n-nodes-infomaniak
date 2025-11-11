/**
 * Signature Resource Handler
 *
 * Handles CRUD operations for Email Signatures
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Signature, DefaultSignatures } from '../types';

export class SignatureResource {
	/**
	 * Execute Signature operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => SignatureResource.getAll(context, itemIndex),
			get: () => SignatureResource.get(context, itemIndex),
			create: () => SignatureResource.create(context, itemIndex),
			update: () => SignatureResource.update(context, itemIndex),
			delete: () => SignatureResource.delete(context, itemIndex),
			setDefaults: () => SignatureResource.setDefaults(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all signatures for a mailbox
	 * GET /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<Signature[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/signatures`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a signature
	 * GET /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/{signature_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const signatureId = context.getNodeParameter('signatureId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Signature>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/signatures/${signatureId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a signature
	 * POST /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const signatureData = context.getNodeParameter('signatureData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			name: signatureData.name,
			content: signatureData.content,
		};

		// Add optional fields
		if (signatureData.is_default_new !== undefined) body.is_default_new = signatureData.is_default_new;
		if (signatureData.is_default_reply !== undefined) body.is_default_reply = signatureData.is_default_reply;

		const data = await infomaniakApiRequestPOST<Signature>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/signatures`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a signature
	 * PUT /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/{signature_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const signatureId = context.getNodeParameter('signatureId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.name !== undefined) body.name = updateData.name;
		if (updateData.content !== undefined) body.content = updateData.content;
		if (updateData.is_default_new !== undefined) body.is_default_new = updateData.is_default_new;
		if (updateData.is_default_reply !== undefined) body.is_default_reply = updateData.is_default_reply;

		const data = await infomaniakApiRequestPUT<Signature>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/signatures/${signatureId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a signature
	 * DELETE /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/{signature_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const signatureId = context.getNodeParameter('signatureId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/signatures/${signatureId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mailHostingId,
			mailboxName,
			signatureId,
			message: `Signature ${signatureId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Set default signatures for a mailbox
	 * PUT /1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/defaults
	 */
	private static async setDefaults(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const mailboxName = context.getNodeParameter('mailboxName', itemIndex) as string;
		const defaultsData = context.getNodeParameter('defaultsData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (defaultsData.default_new_signature_id !== undefined) {
			body.default_new_signature_id = defaultsData.default_new_signature_id;
		}
		if (defaultsData.default_reply_signature_id !== undefined) {
			body.default_reply_signature_id = defaultsData.default_reply_signature_id;
		}

		const data = await infomaniakApiRequestPUT<DefaultSignatures>(
			context,
			`/1/mail_hostings/${mailHostingId}/mailboxes/${mailboxName}/signatures/defaults`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
