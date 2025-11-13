import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { DriveResource, FileResource, UserResource } from './resources';

export class InfomaniakKDrive implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak kDrive',
		name: 'infomaniakKdrive',
		icon: 'file:infomaniak-svgrepo-com.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infomaniak kDrive API for cloud storage',
		defaults: {
			name: 'Infomaniak kDrive',
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
						name: 'Drive',
						value: 'drive',
					},
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'drive',
			},

			// =====================================
			//         Drive Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['drive'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many drives',
						action: 'Get many drives',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a drive',
						action: 'Update a drive',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         File Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['file'],
					},
				},
				options: [
					{
						name: 'Copy',
						value: 'copy',
						description: 'Copy a file',
						action: 'Copy a file',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a file',
						action: 'Delete a file',
					},
					{
						name: 'Get Directory',
						value: 'getDirectory',
						description: 'Get directory contents',
						action: 'Get directory contents',
					},
					{
						name: 'Move',
						value: 'move',
						description: 'Move a file',
						action: 'Move a file',
					},
					{
						name: 'Rename',
						value: 'rename',
						description: 'Rename a file',
						action: 'Rename a file',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for files',
						action: 'Search for files',
					},
				],
				default: 'search',
			},

			// =====================================
			//         User Operations
			// =====================================
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
						name: 'Create',
						value: 'create',
						description: 'Create a user',
						action: 'Create a user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a user',
						action: 'Delete a user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user',
						action: 'Get a user',
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
						action: 'Update a user',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Drive Fields
			// =====================================
			{
				displayName: 'Drive ID',
				name: 'driveId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['drive'],
						operation: ['update'],
					},
				},
				default: 0,
				description: 'The ID of the drive',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['drive'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the drive',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['drive'],
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
						resource: ['drive'],
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
			//         File Fields
			// =====================================
			{
				displayName: 'Drive ID',
				name: 'driveId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
					},
				},
				default: 0,
				description: 'The ID of the drive',
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['delete', 'getDirectory', 'rename', 'copy', 'move'],
					},
				},
				default: 0,
				description: 'The ID of the file',
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['search'],
					},
				},
				default: '',
				description: 'Search query',
			},
			{
				displayName: 'New Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['rename'],
					},
				},
				default: '',
				description: 'New name for the file',
			},
			{
				displayName: 'Destination Directory ID',
				name: 'destinationDirectoryId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['copy', 'move'],
					},
				},
				default: 0,
				description: 'ID of the destination directory',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['search', 'getDirectory'],
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
						resource: ['file'],
						operation: ['search', 'getDirectory'],
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
			//         User Fields
			// =====================================
			{
				displayName: 'Drive ID',
				name: 'driveId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				default: 0,
				description: 'The ID of the drive',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				description: 'The ID of the user',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Email address of the user',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Admin',
						value: 'admin',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'External',
						value: 'external',
					},
				],
				default: 'user',
				description: 'Role of the user',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
							{
								name: 'Admin',
								value: 'admin',
							},
							{
								name: 'User',
								value: 'user',
							},
							{
								name: 'External',
								value: 'external',
							},
						],
						default: 'user',
						description: 'Role of the user',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['user'],
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
						resource: ['user'],
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

				if (resource === 'drive') {
					responseData = await DriveResource.execute(this, operation as string, i);
				} else if (resource === 'file') {
					responseData = await FileResource.execute(this, operation as string, i);
				} else if (resource === 'user') {
					responseData = await UserResource.execute(this, operation as string, i);
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
