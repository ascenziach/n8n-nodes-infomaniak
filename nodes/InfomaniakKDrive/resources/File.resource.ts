/**
 * File Resource Handler
 *
 * Handles operations for kDrive Files
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestDELETE,
	applyPagination,
} from '../utils';
import { File } from '../types';

export class FileResource {
	/**
	 * Execute File operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			copy: () => FileResource.copy(context, itemIndex),
			delete: () => FileResource.delete(context, itemIndex),
			getDirectory: () => FileResource.getDirectory(context, itemIndex),
			move: () => FileResource.move(context, itemIndex),
			rename: () => FileResource.rename(context, itemIndex),
			search: () => FileResource.search(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Copy a file
	 * POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}
	 */
	private static async copy(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const fileId = context.getNodeParameter('fileId', itemIndex) as number;
		const destinationDirectoryId = context.getNodeParameter('destinationDirectoryId', itemIndex) as number;

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: File;
		}>(
			context,
			`/3/drive/${driveId}/files/${fileId}/copy/${destinationDirectoryId}`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Delete a file
	 * DELETE /2/drive/{drive_id}/files/{file_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const fileId = context.getNodeParameter('fileId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/2/drive/${driveId}/files/${fileId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			fileId,
			message: `File ${fileId} deleted successfully`,
		} as IDataObject);
	}

	/**
	 * Get directory contents
	 * GET /3/drive/{drive_id}/files/{file_id}/directory
	 */
	private static async getDirectory(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const fileId = context.getNodeParameter('fileId', itemIndex) as number;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: File[];
		}>(
			context,
			`/3/drive/${driveId}/files/${fileId}/directory`,
			qs,
			itemIndex,
		);

		const files = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(files as unknown as IDataObject[]);
	}

	/**
	 * Move a file
	 * POST /3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}
	 */
	private static async move(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const fileId = context.getNodeParameter('fileId', itemIndex) as number;
		const destinationDirectoryId = context.getNodeParameter('destinationDirectoryId', itemIndex) as number;

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: File;
		}>(
			context,
			`/3/drive/${driveId}/files/${fileId}/move/${destinationDirectoryId}`,
			{},
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Rename a file
	 * POST /2/drive/{drive_id}/files/{file_id}/rename
	 */
	private static async rename(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const fileId = context.getNodeParameter('fileId', itemIndex) as number;
		const name = context.getNodeParameter('name', itemIndex) as string;

		const body: Record<string, unknown> = {
			name,
		};

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: File;
		}>(
			context,
			`/2/drive/${driveId}/files/${fileId}/rename`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Search for files
	 * GET /3/drive/{drive_id}/files/search
	 */
	private static async search(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const driveId = context.getNodeParameter('driveId', itemIndex) as number;
		const query = context.getNodeParameter('query', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		const qs: Record<string, string | number | boolean | undefined> = {
			query,
		};

		if (!returnAll) {
			qs.per_page = limit;
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: File[];
		}>(
			context,
			`/3/drive/${driveId}/files/search`,
			qs,
			itemIndex,
		);

		const files = applyPagination(response.data, returnAll, limit);

		return context.helpers.returnJsonArray(files as unknown as IDataObject[]);
	}
}
