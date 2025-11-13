/**
 * Subscriber Resource Handler
 *
 * Handles operations for Newsletter Subscribers
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Subscriber } from '../types';

export class SubscriberResource {
	/**
	 * Execute Subscriber operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => SubscriberResource.create(context, itemIndex),
			delete: () => SubscriberResource.delete(context, itemIndex),
			get: () => SubscriberResource.get(context, itemIndex),
			getAll: () => SubscriberResource.getAll(context, itemIndex),
			update: () => SubscriberResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a subscriber
	 * POST /1/newsletters/{domain}/subscribers
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const email = context.getNodeParameter('email', itemIndex) as string;
		const status = context.getNodeParameter('status', itemIndex, '') as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {
			email,
		};

		if (status) {
			body.status = status;
		}

		// Handle groups
		if (additionalFields.groups) {
			const groupsValue = additionalFields.groups as IDataObject;
			if (groupsValue.groupIds) {
				body.groups = (groupsValue.groupIds as string).split(',').map((id) => parseInt(id.trim(), 10));
			}
		}

		// Handle custom fields
		if (additionalFields.fields) {
			const fieldsValue = additionalFields.fields as IDataObject;
			if (fieldsValue.field) {
				const fieldValues = fieldsValue.field as Array<{ key: string; value: string }>;
				const fields: Record<string, string> = {};
				fieldValues.forEach((field) => {
					fields[field.key] = field.value;
				});
				body.fields = fields;
			}
		}

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Subscriber;
		}>(
			context,
			`/1/newsletters/${domainId}/subscribers`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a subscriber
	 * DELETE /1/newsletters/{domain}/subscribers/{subscriber}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const subscriberId = context.getNodeParameter('subscriberId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/1/newsletters/${domainId}/subscribers/${subscriberId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			subscriberId,
			message: `Subscriber ${subscriberId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a subscriber
	 * GET /1/newsletters/{domain}/subscribers/{subscriber}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const subscriberId = context.getNodeParameter('subscriberId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Subscriber;
		}>(
			context,
			`/1/newsletters/${domainId}/subscribers/${subscriberId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many subscribers
	 * GET /1/newsletters/{domain}/subscribers
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
		const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		// Handle filters
		if (filters.status) {
			qs['filter[status]'] = filters.status as string;
		}

		if (filters.search) {
			qs['filter[search]'] = filters.search as string;
		}

		if (filters.groups) {
			const groupIds = (filters.groups as string).split(',').map((id) => parseInt(id.trim(), 10));
			qs['filter[groups]'] = groupIds.join(',');
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Subscriber[];
		}>(
			context,
			`/1/newsletters/${domainId}/subscribers`,
			qs,
			itemIndex,
		);

		const subscribers = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(subscribers as unknown as IDataObject[]);
	}

	/**
	 * Update a subscriber
	 * PUT /1/newsletters/{domain}/subscribers/{subscriber}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const domainId = context.getNodeParameter('domainId', itemIndex) as number;
		const subscriberId = context.getNodeParameter('subscriberId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.email) {
			body.email = updateFields.email;
		}

		if (updateFields.status) {
			body.status = updateFields.status;
		}

		// Handle groups
		if (updateFields.groups) {
			const groupsValue = updateFields.groups as IDataObject;
			if (groupsValue.groupIds) {
				body.groups = (groupsValue.groupIds as string).split(',').map((id) => parseInt(id.trim(), 10));
			}
		}

		// Handle custom fields
		if (updateFields.fields) {
			const fieldsValue = updateFields.fields as IDataObject;
			if (fieldsValue.field) {
				const fieldValues = fieldsValue.field as Array<{ key: string; value: string }>;
				const fields: Record<string, string> = {};
				fieldValues.forEach((field) => {
					fields[field.key] = field.value;
				});
				body.fields = fields;
			}
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Subscriber;
		}>(
			context,
			`/1/newsletters/${domainId}/subscribers/${subscriberId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
