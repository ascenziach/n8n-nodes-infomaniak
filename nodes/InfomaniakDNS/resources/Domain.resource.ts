/**
 * Domain Resource Handler
 *
 * Handles operations related to Domain DNS management
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
} from '../utils';
import { DNSSECStatus, NameserverConfig, DNSZone } from '../types';

export class DomainResource {
	/**
	 * Execute Domain operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			checkDNSSEC: () => DomainResource.checkDNSSEC(context, itemIndex),
			enableDNSSEC: () => DomainResource.enableDNSSEC(context, itemIndex),
			disableDNSSEC: () => DomainResource.disableDNSSEC(context, itemIndex),
			updateNameservers: () => DomainResource.updateNameservers(context, itemIndex),
			listZones: () => DomainResource.listZones(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Check DNSSEC status for a domain
	 * GET /2/domains/{domain}/dnssec/check
	 */
	private static async checkDNSSEC(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domain = context.getNodeParameter('domain', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DNSSECStatus>(
			context,
			`/2/domains/${domain}/dnssec/check`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Enable DNSSEC for a domain
	 * POST /2/domains/{domain}/dnssec/enable
	 */
	private static async enableDNSSEC(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domain = context.getNodeParameter('domain', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<DNSSECStatus>(
			context,
			`/2/domains/${domain}/dnssec/enable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Disable DNSSEC for a domain
	 * POST /2/domains/{domain}/dnssec/disable
	 */
	private static async disableDNSSEC(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domain = context.getNodeParameter('domain', itemIndex) as string;

		await infomaniakApiRequestPOST(
			context,
			`/2/domains/${domain}/dnssec/disable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			domain,
			message: 'DNSSEC disabled successfully',
		} as IDataObject);
	}

	/**
	 * Update nameservers for a domain
	 * PUT /2/domains/{domain}/nameservers
	 */
	private static async updateNameservers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domain = context.getNodeParameter('domain', itemIndex) as string;
		const nameservers = context.getNodeParameter('nameservers', itemIndex) as string;

		// Parse nameservers (comma-separated or array)
		const nameserverArray = typeof nameservers === 'string'
			? nameservers.split(',').map((ns) => ns.trim()).filter(Boolean)
			: nameservers;

		const body: Record<string, unknown> = {
			nameservers: nameserverArray as string[],
		};

		const data = await infomaniakApiRequestPUT<NameserverConfig>(
			context,
			`/2/domains/${domain}/nameservers`,
			body as any,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * List zones for a domain
	 * GET /2/domains/{domain}/zones
	 */
	private static async listZones(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domain = context.getNodeParameter('domain', itemIndex) as string;

		const data = await infomaniakApiRequestGET<DNSZone[]>(
			context,
			`/2/domains/${domain}/zones`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}
}
