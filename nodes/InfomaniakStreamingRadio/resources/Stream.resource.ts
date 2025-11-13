/**
 * Stream Resource Handler
 *
 * Handles operations for Streaming Radio Streams
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { Stream } from '../types';

export class StreamResource {
	/**
	 * Execute Stream operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => StreamResource.create(context, itemIndex),
			delete: () => StreamResource.delete(context, itemIndex),
			get: () => StreamResource.get(context, itemIndex),
			getAll: () => StreamResource.getAll(context, itemIndex),
			update: () => StreamResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a stream
	 * POST /1/radios/{radio_product_id}/stations/{station_id}/streams
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;
		const name = context.getNodeParameter('name', itemIndex) as string;
		const format = context.getNodeParameter('format', itemIndex) as string;
		const bitrate = context.getNodeParameter('bitrate', itemIndex) as number;

		const body: Record<string, unknown> = {
			name,
			format,
			bitrate,
		};

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: Stream;
		}>(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}/streams`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a stream
	 * DELETE /1/radios/{radio_product_id}/stations/{station_id}/streams/{stream_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;
		const streamId = context.getNodeParameter('streamId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}/streams/${streamId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			streamId,
			message: `Stream ${streamId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get a stream
	 * GET /1/radios/{radio_product_id}/stations/{station_id}/streams/{stream_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;
		const streamId = context.getNodeParameter('streamId', itemIndex) as number;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Stream;
		}>(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}/streams/${streamId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get many streams
	 * GET /1/radios/{radio_product_id}/stations/{station_id}/streams
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Stream[];
		}>(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}/streams`,
			qs,
			itemIndex,
		);

		const streams = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(streams as unknown as IDataObject[]);
	}

	/**
	 * Update a stream
	 * PUT /1/radios/{radio_product_id}/stations/{station_id}/streams/{stream_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const radioProductId = context.getNodeParameter('radioProductId', itemIndex) as number;
		const stationId = context.getNodeParameter('stationId', itemIndex) as number;
		const streamId = context.getNodeParameter('streamId', itemIndex) as number;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: Record<string, unknown> = {};

		if (updateFields.name) {
			body.name = updateFields.name;
		}

		if (updateFields.format) {
			body.format = updateFields.format;
		}

		if (updateFields.bitrate) {
			body.bitrate = updateFields.bitrate;
		}

		const response = await infomaniakApiRequestPUT<{
			result: string;
			data: Stream;
		}>(
			context,
			`/1/radios/${radioProductId}/stations/${stationId}/streams/${streamId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
