/**
 * Recording Resource Handler
 *
 * Handles operations related to recording configurations
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
} from '../utils';
import { RecordingConfig } from '../types';

export class RecordingResource {
	/**
	 * Execute Recording operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getConfig: () => RecordingResource.getConfig(context, itemIndex),
			createConfig: () => RecordingResource.createConfig(context, itemIndex),
			updateConfig: () => RecordingResource.updateConfig(context, itemIndex),
			startInstant: () => RecordingResource.startInstant(context, itemIndex),
			stopInstant: () => RecordingResource.stopInstant(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get recording configuration
	 * GET /1/videos/{account_id}/channels/{channel}/recording
	 */
	private static async getConfig(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestGET<RecordingConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/recording`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Create recording configuration
	 * POST /1/videos/{account_id}/channels/{channel}/recording
	 */
	private static async createConfig(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};

		if (additionalFields.enabled !== undefined) body.enabled = additionalFields.enabled;
		if (additionalFields.storageMachineId) body.storage_machine_id = additionalFields.storageMachineId;
		if (additionalFields.retentionDays) body.retention_days = additionalFields.retentionDays;

		const data = await infomaniakApiRequestPOST<RecordingConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/recording`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update recording configuration
	 * PUT /1/videos/{account_id}/channels/{channel}/recording
	 */
	private static async updateConfig(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = {};
		if (updateFields.enabled !== undefined) body.enabled = updateFields.enabled;
		if (updateFields.storageMachineId !== undefined) body.storage_machine_id = updateFields.storageMachineId;
		if (updateFields.retentionDays !== undefined) body.retention_days = updateFields.retentionDays;

		const data = await infomaniakApiRequestPUT<RecordingConfig>(
			context,
			`/1/videos/${accountId}/channels/${channel}/recording`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Start instant recording
	 * POST /1/videos/{account_id}/channels/{channel}/recording/start
	 */
	private static async startInstant(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<{ status: string; message: string }>(
			context,
			`/1/videos/${accountId}/channels/${channel}/recording/start`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Stop instant recording
	 * POST /1/videos/{account_id}/channels/{channel}/recording/stop
	 */
	private static async stopInstant(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<{ status: string; message: string }>(
			context,
			`/1/videos/${accountId}/channels/${channel}/recording/stop`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
