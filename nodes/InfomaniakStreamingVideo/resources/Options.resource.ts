/**
 * Options Resource Handler
 *
 * Handles operations related to account options, timeshift, and watermarks
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	applyPagination,
} from '../utils';
import { Option, TimeshiftConfig, WatermarkConfig } from '../types';

export class OptionsResource {
	/**
	 * Execute Options operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => OptionsResource.getAll(context, itemIndex),
			get: () => OptionsResource.get(context, itemIndex),
			recommit: () => OptionsResource.recommit(context, itemIndex),
			terminate: () => OptionsResource.terminate(context, itemIndex),
			getTimeshift: () => OptionsResource.getTimeshift(context, itemIndex),
			createTimeshift: () => OptionsResource.createTimeshift(context, itemIndex),
			updateTimeshift: () => OptionsResource.updateTimeshift(context, itemIndex),
			getWatermark: () => OptionsResource.getWatermark(context, itemIndex),
			updateWatermark: () => OptionsResource.updateWatermark(context, itemIndex),
			enableWatermark: () => OptionsResource.enableWatermark(context, itemIndex),
			disableWatermark: () => OptionsResource.disableWatermark(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get all options
	 * GET /1/videos/{account_id}/options
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const data = await infomaniakApiRequestGET<Option[]>(
			context,
			`/1/videos/${accountId}/options`,
			undefined,
			itemIndex,
		);

		const paginatedData = applyPagination(data, returnAll, limit);

		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single option
	 * GET /1/videos/{account_id}/options/{option}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const option = context.getNodeParameter('option', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Option>(
			context,
			`/1/videos/${accountId}/options/${option}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Recommit an option
	 * POST /1/videos/{account_id}/options/{option}/recommit
	 */
	private static async recommit(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const option = context.getNodeParameter('option', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<Option>(
			context,
			`/1/videos/${accountId}/options/${option}/recommit`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Terminate an option
	 * POST /1/videos/{account_id}/options/{option}/terminate
	 */
	private static async terminate(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const option = context.getNodeParameter('option', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<{ success: boolean; message: string }>(
			context,
			`/1/videos/${accountId}/options/${option}/terminate`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get timeshift configuration
	 * GET /1/videos/{account_id}/channels/{channel}/timeshift
	 */
	private static async getTimeshift(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestGET<TimeshiftConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/timeshift`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create timeshift configuration
	 * POST /1/videos/{account_id}/channels/{channel}/timeshift
	 */
	private static async createTimeshift(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (additionalFields.enabled !== undefined) body.enabled = additionalFields.enabled;
		if (additionalFields.durationMinutes) body.duration_minutes = additionalFields.durationMinutes;

		const data = await infomaniakApiRequestPOST<TimeshiftConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/timeshift`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update timeshift configuration
	 * PUT /1/videos/{account_id}/channels/{channel}/timeshift
	 */
	private static async updateTimeshift(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.enabled !== undefined) body.enabled = updateFields.enabled;
		if (updateFields.durationMinutes !== undefined) body.duration_minutes = updateFields.durationMinutes;

		const data = await infomaniakApiRequestPUT<TimeshiftConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/timeshift`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get watermark configuration
	 * GET /1/videos/{account_id}/channels/{channel}/watermark
	 */
	private static async getWatermark(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestGET<WatermarkConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/watermark`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update watermark configuration
	 * PUT /1/videos/{account_id}/channels/{channel}/watermark
	 */
	private static async updateWatermark(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.imageUrl !== undefined) body.image_url = updateFields.imageUrl;
		if (updateFields.position) body.position = updateFields.position;
		if (updateFields.opacity !== undefined) body.opacity = updateFields.opacity;

		const data = await infomaniakApiRequestPUT<WatermarkConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/watermark`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Enable watermark
	 * POST /1/videos/{account_id}/channels/{channel}/watermark/enable
	 */
	private static async enableWatermark(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<WatermarkConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/watermark/enable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Disable watermark
	 * POST /1/videos/{account_id}/channels/{channel}/watermark/disable
	 */
	private static async disableWatermark(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<WatermarkConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/watermark/disable`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
