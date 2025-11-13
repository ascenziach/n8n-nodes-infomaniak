/**
 * Post Resource Handler
 *
 * Handles operations for kChat Posts (Messages)
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	kChatApiRequestGET,
	kChatApiRequestPOST,
	kChatApiRequestPUT,
	kChatApiRequestDELETE,
} from '../utils';
import { Post } from '../types';

export class PostResource {
	/**
	 * Execute Post operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			create: () => PostResource.create(context, itemIndex),
			get: () => PostResource.get(context, itemIndex),
			getAll: () => PostResource.getAll(context, itemIndex),
			update: () => PostResource.update(context, itemIndex),
			delete: () => PostResource.delete(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Create a post
	 * POST /posts
	 */
	private static async create(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const message = context.getNodeParameter('message', itemIndex) as string;
		const rootId = context.getNodeParameter('rootId', itemIndex, '') as string;

		const body: Record<string, unknown> = {
			channel_id: channelId,
			message,
		};

		if (rootId) {
			body.root_id = rootId;
		}

		const data = await kChatApiRequestPOST<Post>(
			context,
			'/posts',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get a post
	 * GET /posts/{post_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const postId = context.getNodeParameter('postId', itemIndex) as string;

		const data = await kChatApiRequestGET<Post>(
			context,
			`/posts/${postId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Get posts from a channel
	 * GET /channels/{channel_id}/posts
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const channelId = context.getNodeParameter('channelId', itemIndex) as string;
		const limit = context.getNodeParameter('limit', itemIndex, 60) as number;
		const page = context.getNodeParameter('page', itemIndex, 0) as number;

		const qs: Record<string, string | number | boolean | undefined> = {
			per_page: limit,
			page,
		};

		const response = await kChatApiRequestGET<{
			order: string[];
			posts: Record<string, Post>;
		}>(
			context,
			`/channels/${channelId}/posts`,
			qs,
			itemIndex,
		);

		// Convert the posts object to an array
		const posts = response.order.map((postId) => response.posts[postId]);

		return context.helpers.returnJsonArray(posts as unknown as IDataObject[]);
	}

	/**
	 * Update a post
	 * PUT /posts/{post_id}
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const postId = context.getNodeParameter('postId', itemIndex) as string;
		const message = context.getNodeParameter('message', itemIndex) as string;

		const body: Record<string, unknown> = {
			id: postId,
			message,
		};

		const data = await kChatApiRequestPUT<Post>(
			context,
			`/posts/${postId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as IDataObject);
	}

	/**
	 * Delete a post
	 * DELETE /posts/{post_id}
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const postId = context.getNodeParameter('postId', itemIndex) as string;

		await kChatApiRequestDELETE(
			context,
			`/posts/${postId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			postId,
			message: `Post ${postId} deleted successfully`,
		} as IDataObject);
	}
}
