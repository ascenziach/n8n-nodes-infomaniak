/**
 * Restrictions Resource Handler
 *
 * Handles operations related to channel restrictions
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPUT,
} from '../utils';
import { Restrictions } from '../types';

export class RestrictionsResource {
	/**
	 * Execute Restrictions operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			get: () => RestrictionsResource.get(context, itemIndex),
			update: () => RestrictionsResource.update(context, itemIndex),
			updatePassword: () => RestrictionsResource.updatePassword(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get channel restrictions
	 * GET /1/videos/{account_id}/channels/{channel}/restrictions
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Restrictions>(
			context,
			`/1/videos/${accountId}/channels/${channel}/restrictions`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update channel restrictions
	 * PUT /1/videos/{account_id}/channels/{channel}/restrictions
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.passwordEnabled !== undefined) body.password_enabled = updateFields.passwordEnabled;
		if (updateFields.geoRestrictionEnabled !== undefined) body.geo_restriction_enabled = updateFields.geoRestrictionEnabled;
		if (updateFields.allowedCountries) {
			const countries = typeof updateFields.allowedCountries === 'string'
				? updateFields.allowedCountries.split(',').map((c: string) => c.trim())
				: updateFields.allowedCountries;
			body.allowed_countries = countries;
		}
		if (updateFields.blockedCountries) {
			const countries = typeof updateFields.blockedCountries === 'string'
				? updateFields.blockedCountries.split(',').map((c: string) => c.trim())
				: updateFields.blockedCountries;
			body.blocked_countries = countries;
		}
		if (updateFields.domainRestrictionEnabled !== undefined) body.domain_restriction_enabled = updateFields.domainRestrictionEnabled;
		if (updateFields.allowedDomains) {
			const domains = typeof updateFields.allowedDomains === 'string'
				? updateFields.allowedDomains.split(',').map((d: string) => d.trim())
				: updateFields.allowedDomains;
			body.allowed_domains = domains;
		}

		const data = await infomaniakApiRequestPUT<Restrictions>(
			context,
			`/1/videos/${accountId}/channels/${channel}/restrictions`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update restriction password
	 * PUT /1/videos/{account_id}/channels/{channel}/restrictions/password
	 */
	private static async updatePassword(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const password = context.getNodeParameter('password', itemIndex) as string;

		const body: Record<string, unknown> = {
			password,
		};

		const data = await infomaniakApiRequestPUT<{ success: boolean; message: string }>(
			context,
			`/1/videos/${accountId}/channels/${channel}/restrictions/password`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
