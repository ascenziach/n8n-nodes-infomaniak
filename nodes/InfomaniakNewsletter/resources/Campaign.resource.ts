/**
 * Campaign Resource Handler
 *
 * Handles operations for Newsletter Campaigns
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Campaign } from '../types';

export class CampaignResource {
	/**
	 * Execute Campaign operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => CampaignResource.create(context, itemIndex),
			delete: () => CampaignResource.delete(context, itemIndex),
			get: () => CampaignResource.get(context, itemIndex),
			getAll: () => CampaignResource.getAll(context, itemIndex),
			update: () => CampaignResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a campaign
	 * POST /1/newsletters/{domain}/campaigns
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const emailFromAddr = context.getNodeParameter('emailFromAddr', itemIndex) as string;
		const emailFromName = context.getNodeParameter('emailFromName', itemIndex) as string;
		const subject = context.getNodeParameter('subject', itemIndex) as string;
		const lang = context.getNodeParameter('lang', itemIndex) as string;
		const contentHtml = context.getNodeParameter('contentHtml', itemIndex, '') as string;

		const body: Record<string, unknown> = {
			email_from_addr: emailFromAddr,
			email_from_name: emailFromName,
			subject,
			lang,
		};

		if (contentHtml) {
			body.content_html = contentHtml;
		}

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Campaign;
		}>(
			context,
			`/1/newsletters/${domainId}/campaigns`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a campaign
	 * DELETE /1/newsletters/{domain}/campaigns/{campaign}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const campaignId = context.getNodeParameter('campaignId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/1/newsletters/${domainId}/campaigns/${campaignId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			campaignId,
			message: `Campaign ${campaignId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a campaign
	 * GET /1/newsletters/{domain}/campaigns/{campaign}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const campaignId = context.getNodeParameter('campaignId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Campaign;
		}>(
			context,
			`/1/newsletters/${domainId}/campaigns/${campaignId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many campaigns
	 * GET /1/newsletters/{domain}/campaigns
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Campaign[];
		}>(
			context,
			`/1/newsletters/${domainId}/campaigns`,
			qs,
			itemIndex,
		);

		const campaigns = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(campaigns as unknown as IDataObject[]);
	}

	/**
	 * Update a campaign
	 * PUT /1/newsletters/{domain}/campaigns/{campaign}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const campaignId = context.getNodeParameter('campaignId', itemIndex) as number;
		const contentHtml = context.getNodeParameter('contentHtml', itemIndex, '') as string;

		const body: Record<string, unknown> = {};

		if (contentHtml) {
			body.content_html = contentHtml;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Campaign;
		}>(
			context,
			`/1/newsletters/${domainId}/campaigns/${campaignId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
