/**
 * Task Resource Handler
 *
 * Handles operations related to Infomaniak asynchronous Tasks
 */

import { IExecuteFunctions, INodeExecutionData , IDataObject } from 'n8n-workflow';
import { infomaniakApiRequestGET, buildQueryString, applyPagination } from '../utils';
import { Task } from '../types';

export class TaskResource {
	/**
	 * Execute Task operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'getAll') {
			return await this.getAll(context, itemIndex);
		} else if (operation === 'get') {
			return await this.get(context, itemIndex);
		}

		return [];
	}

	/**
	 * Get all tasks
	 * GET /tasks
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const search = context.getNodeParameter('search', itemIndex, '') as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Build query string
		const qs = buildQueryString({
			...(search && { search }),
		});

		// Make API request
		const data = await infomaniakApiRequestGET<Task[]>(
			context,
			'/tasks',
			qs,
			itemIndex,
		);

		// Apply pagination
		const paginatedData = applyPagination(data, returnAll, limit);

		// Return as n8n data
		return context.helpers.returnJsonArray(paginatedData as unknown as IDataObject[]);
	}

	/**
	 * Get a single task by ID
	 * GET /tasks/{task_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const taskId = context.getNodeParameter('taskId', itemIndex) as number;

		// Make API request
		const data = await infomaniakApiRequestGET<Task>(
			context,
			`/tasks/${taskId}`,
			undefined,
			itemIndex,
		);

		// Return as n8n data
		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
