/**
 * Redirection Resource Handler
 *
 * Handles CRUD operations for Email Redirections
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestPATCH,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Redirection } from '../types';

export class RedirectionResource {
	/**
	 * Execute Redirection operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => RedirectionResource.getAll(context, itemIndex),
			get: () => RedirectionResource.get(context, itemIndex),
			create: () => RedirectionResource.create(context, itemIndex),
			update: () => RedirectionResource.update(context, itemIndex),
			delete: () => RedirectionResource.delete(context, itemIndex),
			enable: () => RedirectionResource.enable(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all redirections
	 * GET /1/mail_hostings/{mail_hosting_id}/redirections
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<Redirection[]>(
			context,
			`/1/mail_hostings/${mailHostingId}/redirections`,
			undefined,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a redirection
	 * GET /1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const redirectionId = context.getNodeParameter('redirectionId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Redirection>(
			context,
			`/1/mail_hostings/${mailHostingId}/redirections/${redirectionId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a redirection
	 * POST /1/mail_hostings/{mail_hosting_id}/redirections
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const redirectionData = context.getNodeParameter('redirectionData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {
			source: redirectionData.source,
			destination: redirectionData.destination,
		};

		// Add optional fields
		if (redirectionData.redirection_type) body.redirection_type = redirectionData.redirection_type;
		if (redirectionData.is_enabled !== undefined) body.is_enabled = redirectionData.is_enabled;

		const data = await infomaniakApiRequestPOST<Redirection>(
			context,
			`/1/mail_hostings/${mailHostingId}/redirections`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a redirection
	 * PUT /1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const redirectionId = context.getNodeParameter('redirectionId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.source !== undefined) body.source = updateData.source;
		if (updateData.destination !== undefined) body.destination = updateData.destination;
		if (updateData.redirection_type !== undefined) body.redirection_type = updateData.redirection_type;
		if (updateData.is_enabled !== undefined) body.is_enabled = updateData.is_enabled;

		const data = await infomaniakApiRequestPUT<Redirection>(
			context,
			`/1/mail_hostings/${mailHostingId}/redirections/${redirectionId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a redirection
	 * DELETE /1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const redirectionId = context.getNodeParameter('redirectionId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/1/mail_hostings/${mailHostingId}/redirections/${redirectionId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			mailHostingId,
			redirectionId,
			message: `Redirection ${redirectionId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Enable/disable a redirection
	 * PATCH /1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}/enable
	 */
	private static async enable(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailHostingId = context.getNodeParameter('mailHostingId', itemIndex) as string;
		const redirectionId = context.getNodeParameter('redirectionId', itemIndex) as string;
		const isEnabled = context.getNodeParameter('isEnabled', itemIndex) as boolean;

		const body: Record<string, unknown> = {
			is_enabled: isEnabled,
		};

		const data = await infomaniakApiRequestPATCH<Redirection>(
			context,
			`/1/mail_hostings/${mailHostingId}/redirections/${redirectionId}/enable`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
