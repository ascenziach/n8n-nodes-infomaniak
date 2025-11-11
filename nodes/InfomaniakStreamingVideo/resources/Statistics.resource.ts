/**
 * Statistics Resource Handler
 *
 * Handles operations related to account and channel statistics
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
} from '../utils';
import { ConsumptionStats, ViewerStats, ViewingStats, GeolocationStats, ShareStats } from '../types';

export class StatisticsResource {
	/**
	 * Execute Statistics operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			// Account-level statistics
			getConsumption: () => StatisticsResource.getConsumption(context, itemIndex),
			getConsumptionByChannelHistogram: () => StatisticsResource.getConsumptionByChannelHistogram(context, itemIndex),
			getViewers: () => StatisticsResource.getViewers(context, itemIndex),
			getUniqueViewers: () => StatisticsResource.getUniqueViewers(context, itemIndex),
			getViewersHistogram: () => StatisticsResource.getViewersHistogram(context, itemIndex),
			getViewersByChannelHistogram: () => StatisticsResource.getViewersByChannelHistogram(context, itemIndex),
			getViewersByChannelShare: () => StatisticsResource.getViewersByChannelShare(context, itemIndex),
			getViewing: () => StatisticsResource.getViewing(context, itemIndex),
			getViewingByChannelHistogram: () => StatisticsResource.getViewingByChannelHistogram(context, itemIndex),
			getCountries: () => StatisticsResource.getCountries(context, itemIndex),
			getClusters: () => StatisticsResource.getClusters(context, itemIndex),
			// Channel-level statistics
			getChannelConsumption: () => StatisticsResource.getChannelConsumption(context, itemIndex),
			getChannelConsumptionByResolutionHistogram: () => StatisticsResource.getChannelConsumptionByResolutionHistogram(context, itemIndex),
			getChannelViewers: () => StatisticsResource.getChannelViewers(context, itemIndex),
			getChannelUniqueViewers: () => StatisticsResource.getChannelUniqueViewers(context, itemIndex),
			getChannelViewersHistogram: () => StatisticsResource.getChannelViewersHistogram(context, itemIndex),
			getChannelViewersByResolutionShare: () => StatisticsResource.getChannelViewersByResolutionShare(context, itemIndex),
			getChannelViewersByResolutionHistogram: () => StatisticsResource.getChannelViewersByResolutionHistogram(context, itemIndex),
			getChannelViewing: () => StatisticsResource.getChannelViewing(context, itemIndex),
			getChannelViewingByResolutionHistogram: () => StatisticsResource.getChannelViewingByResolutionHistogram(context, itemIndex),
			getChannelCountries: () => StatisticsResource.getChannelCountries(context, itemIndex),
			getChannelClusters: () => StatisticsResource.getChannelClusters(context, itemIndex),
			getBrowserShare: () => StatisticsResource.getBrowserShare(context, itemIndex),
			getOsShare: () => StatisticsResource.getOsShare(context, itemIndex),
			getPlayerShare: () => StatisticsResource.getPlayerShare(context, itemIndex),
			exportCsv: () => StatisticsResource.exportCsv(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	// Account-level Statistics

	/**
	 * Get account consumption
	 * GET /1/videos/{account_id}/statistics/consumption
	 */
	private static async getConsumption(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET<ConsumptionStats>(
			context,
			`/1/videos/${accountId}/statistics/consumption`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get consumption by channel histogram
	 * GET /1/videos/{account_id}/statistics/consumption/by-channel/histogram
	 */
	private static async getConsumptionByChannelHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/statistics/consumption/by-channel/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get account viewers
	 * GET /1/videos/{account_id}/statistics/viewers
	 */
	private static async getViewers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ViewerStats>(
			context,
			`/1/videos/${accountId}/statistics/viewers`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get unique viewers
	 * GET /1/videos/{account_id}/statistics/viewers/unique
	 */
	private static async getUniqueViewers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ViewerStats>(
			context,
			`/1/videos/${accountId}/statistics/viewers/unique`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get viewers histogram
	 * GET /1/videos/{account_id}/statistics/viewers/histogram
	 */
	private static async getViewersHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/statistics/viewers/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get viewers by channel histogram
	 * GET /1/videos/{account_id}/statistics/viewers/by-channel/histogram
	 */
	private static async getViewersByChannelHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/statistics/viewers/by-channel/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get viewers by channel share
	 * GET /1/videos/{account_id}/statistics/viewers/by-channel/share
	 */
	private static async getViewersByChannelShare(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ShareStats>(
			context,
			`/1/videos/${accountId}/statistics/viewers/by-channel/share`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get account viewing time
	 * GET /1/videos/{account_id}/statistics/viewing
	 */
	private static async getViewing(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ViewingStats>(
			context,
			`/1/videos/${accountId}/statistics/viewing`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get viewing by channel histogram
	 * GET /1/videos/{account_id}/statistics/viewing/by-channel/histogram
	 */
	private static async getViewingByChannelHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/statistics/viewing/by-channel/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get geolocation by countries
	 * GET /1/videos/{account_id}/statistics/geolocation/countries
	 */
	private static async getCountries(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<GeolocationStats>(
			context,
			`/1/videos/${accountId}/statistics/geolocation/countries`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get geolocation by clusters
	 * GET /1/videos/{account_id}/statistics/geolocation/clusters
	 */
	private static async getClusters(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<GeolocationStats>(
			context,
			`/1/videos/${accountId}/statistics/geolocation/clusters`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	// Channel-level Statistics

	/**
	 * Get channel consumption
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/consumption
	 */
	private static async getChannelConsumption(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET<ConsumptionStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/consumption`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel consumption by resolution histogram
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/consumption/by-resolution/histogram
	 */
	private static async getChannelConsumptionByResolutionHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/consumption/by-resolution/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel viewers
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/viewers
	 */
	private static async getChannelViewers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ViewerStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/viewers`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel unique viewers
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/viewers/unique
	 */
	private static async getChannelUniqueViewers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ViewerStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/viewers/unique`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel viewers histogram
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/viewers/histogram
	 */
	private static async getChannelViewersHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/viewers/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel viewers by resolution share
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/viewers/by-resolution/share
	 */
	private static async getChannelViewersByResolutionShare(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ShareStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/viewers/by-resolution/share`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel viewers by resolution histogram
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/viewers/by-resolution/histogram
	 */
	private static async getChannelViewersByResolutionHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/viewers/by-resolution/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel viewing time
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/viewing
	 */
	private static async getChannelViewing(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ViewingStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/viewing`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel viewing by resolution histogram
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/viewing/by-resolution/histogram
	 */
	private static async getChannelViewingByResolutionHistogram(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const qs: Record<string, unknown> = { from, to };
		if (additionalFields.per) qs.per = additionalFields.per;

		const data = await infomaniakApiRequestGET(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/viewing/by-resolution/histogram`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel geolocation by countries
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/geolocation/countries
	 */
	private static async getChannelCountries(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<GeolocationStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/geolocation/countries`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get channel geolocation by clusters
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/geolocation/clusters
	 */
	private static async getChannelClusters(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<GeolocationStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/geolocation/clusters`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get browser share
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/browser/share
	 */
	private static async getBrowserShare(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ShareStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/browser/share`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get OS share
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/os/share
	 */
	private static async getOsShare(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ShareStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/os/share`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get player share
	 * GET /1/videos/{account_id}/channels/{channel}/statistics/player/share
	 */
	private static async getPlayerShare(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const channel = context.getNodeParameter('channel', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;

		const qs: Record<string, unknown> = { from, to };

		const data = await infomaniakApiRequestGET<ShareStats>(
			context,
			`/1/videos/${accountId}/channels/${channel}/statistics/player/share`,
			qs as any,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Export statistics as CSV
	 * POST /1/videos/{account_id}/statistics/export/csv
	 */
	private static async exportCsv(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const from = context.getNodeParameter('from', itemIndex) as string;
		const to = context.getNodeParameter('to', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as Record<string, unknown>;

		const body: Record<string, unknown> = { from, to };
		if (additionalFields.channel) body.channel = additionalFields.channel;
		if (additionalFields.type) body.type = additionalFields.type;

		const data = await infomaniakApiRequestPOST<{ csv_url: string }>(
			context,
			`/1/videos/${accountId}/statistics/export/csv`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
