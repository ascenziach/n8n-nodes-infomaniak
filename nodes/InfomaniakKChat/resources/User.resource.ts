/**
 * User Resource Handler
 *
 * Handles operations for kChat Users
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	kChatApiRequestGET,
	kChatApiRequestPATCH,
} from '../utils';
import { User } from '../types';

export class UserResource {
	/**
	 * Execute User operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			get: () => UserResource.get(context, itemIndex),
			getAll: () => UserResource.getAll(context, itemIndex),
			getByEmail: () => UserResource.getByEmail(context, itemIndex),
			getByUsername: () => UserResource.getByUsername(context, itemIndex),
			update: () => UserResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get a user
	 * GET /users/{user_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const userId = context.getNodeParameter('userId', itemIndex) as string;

		const data = await kChatApiRequestGET<User>(
			context,
			`/users/${userId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get many users
	 * GET /users
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const limit = context.getNodeParameter('limit', itemIndex, 60) as number;
		const page = context.getNodeParameter('page', itemIndex, 0) as number;

		const qs: Record<string, string | number | boolean | undefined> = {
			per_page: limit,
			page,
		};

		const data = await kChatApiRequestGET<User[]>(
			context,
			'/users',
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject[]);
	}

	/**
	 * Get a user by email
	 * GET /users/email/{email}
	 */
	private static async getByEmail(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const email = context.getNodeParameter('email', itemIndex) as string;

		const data = await kChatApiRequestGET<User>(
			context,
			`/users/email/${email}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get a user by username
	 * GET /users/username/{username}
	 */
	private static async getByUsername(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const username = context.getNodeParameter('username', itemIndex) as string;

		const data = await kChatApiRequestGET<User>(
			context,
			`/users/username/${username}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Update a user
	 * PATCH /users/{user_id}/patch
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const userId = context.getNodeParameter('userId', itemIndex) as string;
		const email = context.getNodeParameter('email', itemIndex, '') as string;
		const username = context.getNodeParameter('username', itemIndex, '') as string;
		const firstName = context.getNodeParameter('firstName', itemIndex, '') as string;
		const lastName = context.getNodeParameter('lastName', itemIndex, '') as string;
		const nickname = context.getNodeParameter('nickname', itemIndex, '') as string;

		const body: Record<string, unknown> = {};

		if (email) {
			body.email = email;
		}
		if (username) {
			body.username = username;
		}
		if (firstName) {
			body.first_name = firstName;
		}
		if (lastName) {
			body.last_name = lastName;
		}
		if (nickname) {
			body.nickname = nickname;
		}

		const data = await kChatApiRequestPATCH<User>(
			context,
			`/users/${userId}/patch`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}
}
