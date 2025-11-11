/**
 * Zone Resource Handler
 *
 * Handles CRUD operations for DNS Zones
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
} from '../utils';
import { DNSZone } from '../types';

export class ZoneResource {
	/**
	 * Execute Zone operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			get: () => ZoneResource.get(context, itemIndex),
			create: () => ZoneResource.create(context, itemIndex),
			update: () => ZoneResource.update(context, itemIndex),
			delete: () => ZoneResource.delete(context, itemIndex),
			exists: () => ZoneResource.exists(context, itemIndex),
			import: () => ZoneResource.importZone(context, itemIndex),
			export: () => ZoneResource.exportZone(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get a DNS zone
	 * GET /2/zones/{zone}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DNSZone>(
			context,
			`/2/zones/${zoneId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create a DNS zone
	 * POST /2/zones/{zone}
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const zoneData = context.getNodeParameter('zoneData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (zoneData.source) body.source = zoneData.source;
		if (zoneData.contactEmails) {
			body.contact_emails = typeof zoneData.contactEmails === 'string'
				? (zoneData.contactEmails as string).split(',').map((e) => e.trim())
				: zoneData.contactEmails;
		}

		const data = await infomaniakApiRequestPOST<DNSZone>(
			context,
			`/2/zones/${zoneId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a DNS zone
	 * PUT /2/zones/{zone}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		const updateData = context.getNodeParameter('updateData', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateData.contactEmails) {
			body.contact_emails = typeof updateData.contactEmails === 'string'
				? (updateData.contactEmails as string).split(',').map((e) => e.trim())
				: updateData.contactEmails;
		}
		if (updateData.dnssecStatus !== undefined) {
			body.dnssec_status = updateData.dnssecStatus;
		}

		const data = await infomaniakApiRequestPUT<DNSZone>(
			context,
			`/2/zones/${zoneId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a DNS zone
	 * DELETE /2/zones/{zone}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/2/zones/${zoneId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			zoneId,
			message: `Zone ${zoneId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Check if a zone exists
	 * GET /2/zones/{zone}/exists
	 */
	private static async exists(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<{ exists: boolean }>(
			context,
			`/2/zones/${zoneId}/exists`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Import zone data (placeholder for future implementation)
	 */
	private static async importZone(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;
		// const zoneFile = context.getNodeParameter('zoneFile', itemIndex) as string;

		// This would typically parse a BIND zone file
		// For now, return a placeholder
		return context.helpers.returnJsonArray({
			success: false,
			message: 'Zone import not yet implemented',
			zoneId,
		} as IDataObject);
	}

	/**
	 * Export zone data (placeholder for future implementation)
	 */
	private static async exportZone(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const zoneId = context.getNodeParameter('zoneId', itemIndex) as string;

		// Get zone with all records and format as BIND zone file
		// For now, return a placeholder
		return context.helpers.returnJsonArray({
			success: false,
			message: 'Zone export not yet implemented',
			zoneId,
		} as IDataObject);
	}
}
