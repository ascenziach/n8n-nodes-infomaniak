/**
 * Live Resource Handler
 *
 * Handles operations related to live streaming
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestPOST,
} from '../utils';

export class LiveResource {
	/**
	 * Execute Live operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			start: () => LiveResource.start(context, itemIndex),
			stop: () => LiveResource.stop(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Start/resume live stream
	 * POST /1/videos/{account_id}/channels/{channel}/live/start
	 */
	private static async start(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<{ status: string; message: string }>(
			context,
			`/1/videos/${accountId}/channels/${channel}/live/start`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Stop/interrupt live stream
	 * POST /1/videos/{account_id}/channels/{channel}/live/stop
	 */
	private static async stop(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;

		const data = await infomaniakApiRequestPOST<{ status: string; message: string }>(
			context,
			`/1/videos/${accountId}/channels/${channel}/live/stop`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
