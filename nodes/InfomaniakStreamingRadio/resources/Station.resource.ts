/**
 * Station Resource Handler
 *
 * Handles operations for Streaming Radio Stations
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Station } from '../types';

export class StationResource {
	/**
	 * Execute Station operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => StationResource.create(context, itemIndex),
			delete: () => StationResource.delete(context, itemIndex),
			get: () => StationResource.get(context, itemIndex),
			getAll: () => StationResource.getAll(context, itemIndex),
			update: () => StationResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a station
	 * POST /1/radios/{radio_product_id}/stations
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const name = context.getNodeParameter('name', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {
			name,
		};

		if (additionalFields.is_daily_restart !== undefined) {
			body.is_daily_restart = additionalFields.is_daily_restart;
		}

		if (additionalFields.is_send_logs !== undefined) {
			body.is_send_logs = additionalFields.is_send_logs;
		}

		if (additionalFields.time_daily_restart) {
			body.time_daily_restart = additionalFields.time_daily_restart;
		}

		if (additionalFields.timezone_daily_restart) {
			body.timezone_daily_restart = additionalFields.timezone_daily_restart;
		}

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Station;
		}>(
			context,
			`/1/radios/${radioProductId}/stations`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a station
	 * DELETE /1/radios/{radio_product_id}/stations/{station_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			stationId,
			message: `Station ${stationId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a station
	 * GET /1/radios/{radio_product_id}/stations/{station_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Station;
		}>(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many stations
	 * GET /1/radios/{radio_product_id}/stations
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Station[];
		}>(
			context,
			`/1/radios/${radioProductId}/stations`,
			qs,
			itemIndex,
		);

		const stations = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(stations as unknown as IDataObject[]);
	}

	/**
	 * Update a station
	 * PUT /1/radios/{radio_product_id}/stations/{station_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.name) {
			body.name = updateFields.name;
		}

		if (updateFields.is_daily_restart !== undefined) {
			body.is_daily_restart = updateFields.is_daily_restart;
		}

		if (updateFields.is_send_logs !== undefined) {
			body.is_send_logs = updateFields.is_send_logs;
		}

		if (updateFields.time_daily_restart) {
			body.time_daily_restart = updateFields.time_daily_restart;
		}

		if (updateFields.timezone_daily_restart) {
			body.timezone_daily_restart = updateFields.timezone_daily_restart;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Station;
		}>(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
