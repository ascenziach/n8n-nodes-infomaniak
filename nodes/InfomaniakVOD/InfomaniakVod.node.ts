import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { ChannelResource, MediaResource, FolderResource, PlayerResource } from './resources';

export class InfomaniakVOD implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak VOD',
		name: 'infomaniakVod',
		icon: 'file:infomaniak-svgrepo-com.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infomaniak VOD (Video On Demand) API',
		defaults: {
			name: 'Infomaniak VOD',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'infomaniakApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.infomaniak.com',
		},
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
					},
					{
						name: 'Folder',
						value: 'folder',
					},
					{
						name: 'Media',
						value: 'media',
					},
					{
						name: 'Player',
						value: 'player',
					},
				],
				default: 'channel',
			},

			// =====================================
			//         Channel Operations
			// =====================================
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
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many channels',
						action: 'Get many channels',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Media Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['media'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a media',
						action: 'Delete a media',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a media',
						action: 'Get a media',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many media',
						action: 'Get many media',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a media',
						action: 'Update a media',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Folder Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['folder'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a folder',
						action: 'Create a folder',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a folder',
						action: 'Delete a folder',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a folder',
						action: 'Get a folder',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many folders',
						action: 'Get many folders',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a folder',
						action: 'Update a folder',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Player Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['player'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a player',
						action: 'Create a player',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a player',
						action: 'Delete a player',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a player',
						action: 'Get a player',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many players',
						action: 'Get many players',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a player',
						action: 'Update a player',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Channel Fields
			// =====================================
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// =====================================
			//         Media Fields
			// =====================================
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['media'],
					},
				},
				default: '',
				description: 'The ID of the channel',
			},
			{
				displayName: 'Media ID',
				name: 'mediaId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the media',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Title of the media',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the media',
					},
					{
						displayName: 'Published',
						name: 'published',
						type: 'boolean',
						default: true,
						description: 'Whether the media is published',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// =====================================
			//         Folder Fields
			// =====================================
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['folder'],
					},
				},
				default: '',
				description: 'The ID of the channel',
			},
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the folder',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the folder',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// =====================================
			//         Player Fields
			// =====================================
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
					},
				},
				default: '',
				description: 'The ID of the channel',
			},
			{
				displayName: 'Player ID',
				name: 'playerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the player',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the player',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: INodeExecutionData[] = [];

				if (resource === 'channel') {
					responseData = await ChannelResource.execute(this, operation as string, i);
				} else if (resource === 'media') {
					responseData = await MediaResource.execute(this, operation as string, i);
				} else if (resource === 'folder') {
					responseData = await FolderResource.execute(this, operation as string, i);
				} else if (resource === 'player') {
					responseData = await PlayerResource.execute(this, operation as string, i);
				}

				returnData.push(...responseData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
