/**
 * DNS Record Resource Handler
 *
 * Handles CRUD operations for DNS Records
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { DNSRecord, DNSRecordType } from '../types';

export class DNSRecordResource {
	/**
	 * Execute DNS Record operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => DNSRecordResource.getAll(context, itemIndex),
			get: () => DNSRecordResource.get(context, itemIndex),
			create: () => DNSRecordResource.create(context, itemIndex),
			update: () => DNSRecordResource.update(context, itemIndex),
			delete: () => DNSRecordResource.delete(context, itemIndex),
			check: () => DNSRecordResource.check(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all DNS records for a zone
	 * GET /2/zones/{zone}/records
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
		const filters = context.getNodeParameter('filters', itemIndex, {}) as Record<string, unknown>;

		// Build query string for filtering
		const qs: any = {};
		if (filters.type) qs.type = filters.type;
		if (filters.source) qs.source = filters.source;

		const data = await infomaniakApiRequestGET<DNSRecord[]>(
			context,
			`/2/zones/${zoneId}/records`,
			qs as any,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single DNS record
	 * GET /2/zones/{zone}/records/{record}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const recordId = context.getNodeParameter('recordId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DNSRecord>(
			context,
			`/2/zones/${zoneId}/records/${recordId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a DNS record
	 * POST /2/zones/{zone}/records
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const recordData = context.getNodeParameter('recordData', itemIndex) as Record<string, unknown>;

		// Build record body
		const body: Record<string, unknown> = {
			type: recordData.type as DNSRecordType,
			source: recordData.source,
			target: recordData.target,
		};

		// Add optional fields
		if (recordData.ttl) body.ttl = recordData.ttl;
		if (recordData.priority) body.priority = recordData.priority;
		if (recordData.comment) body.comment = recordData.comment;

		const data = await infomaniakApiRequestPOST<DNSRecord>(
			context,
			`/2/zones/${zoneId}/records`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a DNS record
	 * PUT /2/zones/{zone}/records/{record}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const recordId = context.getNodeParameter('recordId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex) as Record<string, unknown>;

		// Build update body
		const body: Record<string, unknown> = {};
		if (updateData.type) body.type = updateData.type;
		if (updateData.source) body.source = updateData.source;
		if (updateData.target) body.target = updateData.target;
		if (updateData.ttl !== undefined) body.ttl = updateData.ttl;
		if (updateData.priority !== undefined) body.priority = updateData.priority;
		if (updateData.comment !== undefined) body.comment = updateData.comment;

		const data = await infomaniakApiRequestPUT<DNSRecord>(
			context,
			`/2/zones/${zoneId}/records/${recordId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a DNS record
	 * DELETE /2/zones/{zone}/records/{record}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const recordId = context.getNodeParameter('recordId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/2/zones/${zoneId}/records/${recordId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			zoneId,
			recordId,
			message: `DNS record ${recordId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Check DNS record propagation
	 * GET /2/zones/{zone}/records/{record}/check
	 */
	private static async check(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const recordId = context.getNodeParameter('recordId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<{ propagated: boolean; nameservers: Record<string, boolean> }>(
			context,
			`/2/zones/${zoneId}/records/${recordId}/check`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
