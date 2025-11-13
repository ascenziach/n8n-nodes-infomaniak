import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	ChannelResource,
	PostResource,
	UserResource,
	TeamResource,
} from './resources';

export class InfomaniakKChat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak kChat',
		name: 'infomaniakKChat',
		icon: 'file:InfomaniakKChat.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infomaniak kChat messaging platform - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak kChat',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'infomaniakApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Channel',
						value: 'channel',
						description: 'Manage channels',
					},
					{
						name: 'Post',
						value: 'post',
						description: 'Manage posts (messages)',
					},
					{
						name: 'Team',
						value: 'team',
						description: 'Manage teams',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage users',
					},
				],
				default: 'channel',
			},
			// Channel Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['channel'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a channel',
						action: 'Create channel',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a channel',
						action: 'Delete channel',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a channel',
						action: 'Get channel',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many channels',
						action: 'Get many channels',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a channel',
						action: 'Update channel',
					},
				],
				default: 'getAll',
			},
			// Post Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a post',
						action: 'Create post',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a post',
						action: 'Delete post',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a post',
						action: 'Get post',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many posts from a channel',
						action: 'Get many posts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a post',
						action: 'Update post',
					},
				],
				default: 'create',
			},
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user',
						action: 'Get user',
					},
					{
						name: 'Get By Email',
						value: 'getByEmail',
						description: 'Get a user by email',
						action: 'Get user by email',
					},
					{
						name: 'Get By Username',
						value: 'getByUsername',
						description: 'Get a user by username',
						action: 'Get user by username',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many users',
						action: 'Get many users',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a user',
						action: 'Update user',
					},
				],
				default: 'get',
			},
			// Team Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['team'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a team',
						action: 'Create team',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a team',
						action: 'Delete team',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a team',
						action: 'Get team',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many teams',
						action: 'Get many teams',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a team',
						action: 'Update team',
					},
				],
				default: 'getAll',
			},
			// ===========================================
			// Channel Fields
			// ===========================================
			// Channel ID (for get, update, delete, getAll posts)
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the channel',
			},
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create', 'getAll'],
					},
				},
				description: 'The ID of the channel',
			},
			// Team ID (for create channel, getAll channels)
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create', 'getAll'],
					},
				},
				description: 'The ID of the team',
			},
			// Channel name (for create)
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create'],
					},
				},
				description: 'The unique handle for the channel (lowercase, no spaces)',
			},
			// Channel display name (for create, update)
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create'],
					},
				},
				description: 'The display name for the channel',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['update'],
					},
				},
				description: 'The display name for the channel',
			},
			// Channel type (for create)
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'O',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Public',
						value: 'O',
					},
					{
						name: 'Private',
						value: 'P',
					},
				],
				description: 'The type of channel',
			},
			// Channel purpose (for create, update)
			{
				displayName: 'Purpose',
				name: 'purpose',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create', 'update'],
					},
				},
				description: 'A short description of the channel purpose',
			},
			// Channel header (for create, update)
			{
				displayName: 'Header',
				name: 'header',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create', 'update'],
					},
				},
				description: 'Markdown-formatted text to display in the channel header',
			},
			// Pagination fields for channels
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['getAll'],
					},
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['getAll'],
					},
				},
				description: 'The page to select',
			},
			// ===========================================
			// Post Fields
			// ===========================================
			// Post ID (for get, update, delete)
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the post',
			},
			// Message (for create, update)
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create', 'update'],
					},
				},
				description: 'The message text',
			},
			// Root ID (for create - reply to thread)
			{
				displayName: 'Root ID',
				name: 'rootId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
					},
				},
				description: 'The post ID to reply to (for threaded replies)',
			},
			// Pagination fields for posts
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
					},
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
					},
				},
				description: 'The page to select',
			},
			// ===========================================
			// User Fields
			// ===========================================
			// User ID (for get, update)
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'update'],
					},
				},
				description: 'The ID of the user',
			},
			// Email (for getByEmail, update)
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getByEmail'],
					},
				},
				description: 'The email address of the user',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update'],
					},
				},
				description: 'The new email address',
			},
			// Username (for getByUsername, update)
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getByUsername'],
					},
				},

			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update'],
					},
				},
				description: 'The new username',
			},
			// First Name (for update)
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update'],
					},
				},

			},
			// Last Name (for update)
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update'],
					},
				},

			},
			// Nickname (for update)
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update'],
					},
				},

			},
			// Pagination fields for users
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getAll'],
					},
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getAll'],
					},
				},
				description: 'The page to select',
			},
			// ===========================================
			// Team Fields
			// ===========================================
			// Team ID (for get, update, delete)
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the team',
			},
			// Team name (for create)
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['create'],
					},
				},
				description: 'The unique handle for the team (lowercase, no spaces)',
			},
			// Team display name (for create, update)
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['create'],
					},
				},
				description: 'The display name for the team',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['update'],
					},
				},
				description: 'The display name for the team',
			},
			// Team type (for create)
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'O',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Open',
						value: 'O',
					},
					{
						name: 'Invite Only',
						value: 'I',
					},
				],
				description: 'The type of team',
			},
			// Team description (for update)
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['update'],
					},
				},
				description: 'The team description',
			},
			// Pagination fields for teams
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['getAll'],
					},
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['getAll'],
					},
				},
				description: 'The page to select',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				if (resource === 'channel') {
					result = await ChannelResource.execute(this, operation, i);
				} else if (resource === 'post') {
					result = await PostResource.execute(this, operation, i);
				} else if (resource === 'user') {
					result = await UserResource.execute(this, operation, i);
				} else if (resource === 'team') {
					result = await TeamResource.execute(this, operation, i);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
