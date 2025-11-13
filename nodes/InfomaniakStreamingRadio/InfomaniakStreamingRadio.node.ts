import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { RadioProductResource, StationResource, StreamResource, PlayerResource } from './resources';

export class InfomaniakStreamingRadio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak Streaming Radio',
		name: 'infomaniakStreamingRadio',
		icon: 'file:infomaniak-svgrepo-com.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infomaniak Streaming Radio API',
		defaults: {
			name: 'Infomaniak Streaming Radio',
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
						name: 'Player',
						value: 'player',
					},
					{
						name: 'Radio Product',
						value: 'radioProduct',
					},
					{
						name: 'Station',
						value: 'station',
					},
					{
						name: 'Stream',
						value: 'stream',
					},
				],
				default: 'radioProduct',
			},

			// =====================================
			//         RadioProduct Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['radioProduct'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a radio product',
						action: 'Get a radio product',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many radio products',
						action: 'Get many radio products',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Station Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['station'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a station',
						action: 'Create a station',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a station',
						action: 'Delete a station',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a station',
						action: 'Get a station',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many stations',
						action: 'Get many stations',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a station',
						action: 'Update a station',
					},
				],
				default: 'getAll',
			},

			// =====================================
			//         Stream Operations
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['stream'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a stream',
						action: 'Create a stream',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a stream',
						action: 'Delete a stream',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a stream',
						action: 'Get a stream',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many streams',
						action: 'Get many streams',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a stream',
						action: 'Update a stream',
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
			//         RadioProduct Fields
			// =====================================
			{
				displayName: 'Radio Product ID',
				name: 'radioProductId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['radioProduct'],
						operation: ['get'],
					},
				},
				default: 0,
				description: 'The ID of the radio product',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['radioProduct'],
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
						resource: ['radioProduct'],
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
			//         Station Fields
			// =====================================
			{
				displayName: 'Radio Product ID',
				name: 'radioProductId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['station'],
					},
				},
				default: 0,
				description: 'The ID of the radio product',
			},
			{
				displayName: 'Station ID',
				name: 'stationId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['station'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				description: 'The ID of the station',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['station'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the station',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['station'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Is Daily Restart',
						name: 'is_daily_restart',
						type: 'boolean',
						default: false,
						description: 'Whether the station should restart daily',
					},
					{
						displayName: 'Is Send Logs',
						name: 'is_send_logs',
						type: 'boolean',
						default: false,
						description: 'Whether to send logs',
					},
					{
						displayName: 'Time Daily Restart',
						name: 'time_daily_restart',
						type: 'string',
						default: '',
						description: 'Time for daily restart (HH:mm format)',
					},
					{
						displayName: 'Timezone Daily Restart',
						name: 'timezone_daily_restart',
						type: 'string',
						default: '',
						description: 'Timezone for daily restart',
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
						resource: ['station'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Is Daily Restart',
						name: 'is_daily_restart',
						type: 'boolean',
						default: false,
						description: 'Whether the station should restart daily',
					},
					{
						displayName: 'Is Send Logs',
						name: 'is_send_logs',
						type: 'boolean',
						default: false,
						description: 'Whether to send logs',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name of the station',
					},
					{
						displayName: 'Time Daily Restart',
						name: 'time_daily_restart',
						type: 'string',
						default: '',
						description: 'Time for daily restart (HH:mm format)',
					},
					{
						displayName: 'Timezone Daily Restart',
						name: 'timezone_daily_restart',
						type: 'string',
						default: '',
						description: 'Timezone for daily restart',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['station'],
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
						resource: ['station'],
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
			//         Stream Fields
			// =====================================
			{
				displayName: 'Radio Product ID',
				name: 'radioProductId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['stream'],
					},
				},
				default: 0,
				description: 'The ID of the radio product',
			},
			{
				displayName: 'Station ID',
				name: 'stationId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['stream'],
					},
				},
				default: 0,
				description: 'The ID of the station',
			},
			{
				displayName: 'Stream ID',
				name: 'streamId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['stream'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				description: 'The ID of the stream',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['stream'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the stream',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['stream'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'MP3',
						value: 'mp3',
					},
					{
						name: 'AAC',
						value: 'aac',
					},
				],
				default: 'mp3',
				description: 'The format of the stream',
			},
			{
				displayName: 'Bitrate',
				name: 'bitrate',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['stream'],
						operation: ['create'],
					},
				},
				default: 128,
				description: 'The bitrate of the stream',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['stream'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name of the stream',
					},
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{
								name: 'MP3',
								value: 'mp3',
							},
							{
								name: 'AAC',
								value: 'aac',
							},
						],
						default: 'mp3',
						description: 'The format of the stream',
					},
					{
						displayName: 'Bitrate',
						name: 'bitrate',
						type: 'number',
						default: 128,
						description: 'The bitrate of the stream',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['stream'],
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
						resource: ['stream'],
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
				displayName: 'Radio Product ID',
				name: 'radioProductId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
					},
				},
				default: 0,
				description: 'The ID of the radio product',
			},
			{
				displayName: 'Player ID',
				name: 'playerId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				description: 'The ID of the player',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the player',
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
						description: 'The name of the player',
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

				if (resource === 'radioProduct') {
					responseData = await RadioProductResource.execute(this, operation as string, i);
				} else if (resource === 'station') {
					responseData = await StationResource.execute(this, operation as string, i);
				} else if (resource === 'stream') {
					responseData = await StreamResource.execute(this, operation as string, i);
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
