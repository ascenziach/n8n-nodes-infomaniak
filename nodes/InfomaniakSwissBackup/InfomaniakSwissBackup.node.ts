import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { SwissBackupResource, SlotResource } from './resources';

export class InfomaniakSwissBackup implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak Swiss Backup',
		name: 'infomaniakSwissBackup',
		icon: 'file:infomaniak-svgrepo-com.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infomaniak Swiss Backup API',
		defaults: {
			name: 'Infomaniak Swiss Backup',
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
						name: 'Slot',
						value: 'slot',
					},
					{
						name: 'Swiss Backup',
						value: 'swissBackup',
					},
				],
				default: 'swissBackup',
			},

			// =====================================
			//         SwissBackup Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['swissBackup'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a Swiss Backup',
						action: 'Get a swiss backup',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many Swiss Backups',
						action: 'Get many swiss backups',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a Swiss Backup',
						action: 'Update a swiss backup',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Slot Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['slot'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a slot',
						action: 'Create a slot',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a slot',
						action: 'Delete a slot',
					},
					{
						name: 'Disable',
						value: 'disable',
						description: 'Disable a slot',
						action: 'Disable a slot',
					},
					{
						name: 'Enable',
						value: 'enable',
						description: 'Enable a slot',
						action: 'Enable a slot',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a slot',
						action: 'Get a slot',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many slots',
						action: 'Get many slots',
					},
					{
						name: 'Request Password',
						value: 'requestPassword',
						description: 'Request password for a slot',
						action: 'Request password for a slot',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a slot',
						action: 'Update a slot',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         SwissBackup Fields
			// =====================================
			{
				displayName: 'Swiss Backup ID',
				name: 'swissBackupId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['swissBackup'],
						operation: ['get', 'update'],
					},
				},
				default: 0,
				description: 'The ID of the Swiss Backup',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['swissBackup'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Periodicity',
						name: 'periodicity',
						type: 'options',
						options: [
							{
								name: 'Monthly',
								value: 'monthly',
							},
							{
								name: 'Yearly',
								value: 'yearly',
							},
						],
						default: 'monthly',
						description: 'Billing periodicity',
					},
					{
						displayName: 'Storage Reserved Acronis',
						name: 'storage_reserved_acronis',
						type: 'number',
						default: 0,
						description: 'Storage reserved for Acronis in GB',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['swissBackup'],
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
						resource: ['swissBackup'],
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
			//         Slot Fields
			// =====================================
			{
				displayName: 'Swiss Backup ID',
				name: 'swissBackupId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['slot'],
					},
				},
				default: 0,
				description: 'The ID of the Swiss Backup',
			},
			{
				displayName: 'Slot ID',
				name: 'slotId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['slot'],
						operation: ['get', 'update', 'delete', 'enable', 'disable', 'requestPassword'],
					},
				},
				default: 0,
				description: 'The ID of the slot',
			},
			{
				displayName: 'Customer Name',
				name: 'customer_name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['slot'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Name of the customer',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['slot'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Email address',
			},
			{
				displayName: 'Size',
				name: 'size',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['slot'],
						operation: ['create'],
					},
				},
				default: 100,
				description: 'Size in GB',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['slot'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Acronis',
						value: 'acronis',
					},
					{
						name: 'Dedicated',
						value: 'dedicated',
					},
				],
				default: 'dedicated',
				description: 'Type of the slot',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['slot'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Connection Type',
						name: 'connection_type',
						type: 'options',
						options: [
							{
								name: 'FTP',
								value: 'ftp',
							},
							{
								name: 'SFTP',
								value: 'sftp',
							},
						],
						default: 'sftp',
						description: 'Connection type',
					},
					{
						displayName: 'Firstname',
						name: 'firstname',
						type: 'string',
						default: '',
						description: 'First name of the customer',
					},
					{
						displayName: 'Lastname',
						name: 'lastname',
						type: 'string',
						default: '',
						description: 'Last name of the customer',
					},
					{
						displayName: 'Language',
						name: 'lang',
						type: 'options',
						options: [
							{
								name: 'Deutsch',
								value: 'de',
							},
							{
								name: 'English',
								value: 'en',
							},
							{
								name: 'Español',
								value: 'es',
							},
							{
								name: 'Français',
								value: 'fr',
							},
							{
								name: 'Italiano',
								value: 'it',
							},
						],
						default: 'en',
						description: 'Language preference',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['slot'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Customer Name',
						name: 'customer_name',
						type: 'string',
						default: '',
						description: 'Name of the customer',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Email address',
					},
					{
						displayName: 'Size',
						name: 'size',
						type: 'number',
						default: 100,
						description: 'Size in GB',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['slot'],
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
						resource: ['slot'],
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

				if (resource === 'swissBackup') {
					responseData = await SwissBackupResource.execute(this, operation as string, i);
				} else if (resource === 'slot') {
					responseData = await SlotResource.execute(this, operation as string, i);
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
