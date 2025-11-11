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
	LiveResource,
	EventResource,
	PlayerResource,
	AdsResource,
	RecordingResource,
	StorageResource,
	SimulcastResource,
	RestrictionsResource,
	StatisticsResource,
	IntegrationResource,
	OptionsResource,
} from './resources';

export class InfomaniakStreamingVideo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak Streaming Video',
		name: 'infomaniakStreamingVideo',
		icon: 'file:InfomaniakStreamingVideo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage streaming video channels, players, and statistics with Infomaniak API - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak Streaming Video',
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
						name: 'Ad',
						value: 'ads',
						description: 'Manage advertising configurations',
					},
					{
						name: 'Channel',
						value: 'channel',
						description: 'Manage streaming channels',
					},
					{
						name: 'Event',
						value: 'event',
						description: 'Manage repeatable planned events',
					},
					{
						name: 'Integration',
						value: 'integration',
						description: 'Get integration codes and embed URLs',
					},
					{
						name: 'Live',
						value: 'live',
						description: 'Control live streaming',
					},
					{
						name: 'Option',
						value: 'options',
						description: 'Manage account options, timeshift, and watermarks',
					},
					{
						name: 'Player',
						value: 'player',
						description: 'Manage video players',
					},
					{
						name: 'Recording',
						value: 'recording',
						description: 'Manage recording configurations',
					},
					{
						name: 'Restriction',
						value: 'restrictions',
						description: 'Manage channel access restrictions',
					},
					{
						name: 'Simulcast',
						value: 'simulcast',
						description: 'Manage simulcast configurations',
					},
					{
						name: 'Statistic',
						value: 'statistics',
						description: 'Get account and channel statistics',
					},
					{
						name: 'Storage',
						value: 'storage',
						description: 'Manage storage machines',
					},
				],
				default: 'channel',
			},
			// Common Parameters
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'The account identifier',
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
						name: 'Configure Encoding',
						value: 'configureEncoding',
						description: 'Configure encoding settings for a channel',
						action: 'Configure encoding settings',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new channel',
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
						name: 'Get Thumbnail',
						value: 'getThumbnail',
						description: 'Get channel thumbnail',
						action: 'Get channel thumbnail',
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
			// Live Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['live'],
					},
				},
				options: [
					{
						name: 'Start',
						value: 'start',
						description: 'Start or resume live stream',
						action: 'Start live stream',
					},
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop or interrupt live stream',
						action: 'Stop live stream',
					},
				],
				default: 'start',
			},
			// Event Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new event',
						action: 'Create event',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an event',
						action: 'Delete event',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an event',
						action: 'Get event',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many events for a channel',
						action: 'Get many events',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an event',
						action: 'Update event',
					},
				],
				default: 'getAll',
			},
			// Player Operations
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
						name: 'Copy',
						value: 'copy',
						description: 'Copy/duplicate a player',
						action: 'Copy player',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new player',
						action: 'Create player',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a player',
						action: 'Delete player',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a player',
						action: 'Get player',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many players',
						action: 'Get many players',
					},
					{
						name: 'Get Thumbnail',
						value: 'getThumbnail',
						description: 'Get player thumbnail',
						action: 'Get player thumbnail',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a player',
						action: 'Update player',
					},
				],
				default: 'getAll',
			},
			// Ads Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ads'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new ads configuration',
						action: 'Create ads configuration',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an ads configuration',
						action: 'Delete ads configuration',
					},
					{
						name: 'Duplicate',
						value: 'duplicate',
						description: 'Duplicate an ads configuration',
						action: 'Duplicate ads configuration',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an ads configuration',
						action: 'Get ads configuration',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many ads configurations',
						action: 'Get many ads configurations',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an ads configuration',
						action: 'Update ads configuration',
					},
				],
				default: 'getAll',
			},
			// Recording Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['recording'],
					},
				},
				options: [
					{
						name: 'Create Config',
						value: 'createConfig',
						description: 'Create recording configuration',
						action: 'Create recording configuration',
					},
					{
						name: 'Get Config',
						value: 'getConfig',
						description: 'Get recording configuration',
						action: 'Get recording configuration',
					},
					{
						name: 'Start Instant',
						value: 'startInstant',
						description: 'Start instant recording',
						action: 'Start instant recording',
					},
					{
						name: 'Stop Instant',
						value: 'stopInstant',
						description: 'Stop instant recording',
						action: 'Stop instant recording',
					},
					{
						name: 'Update Config',
						value: 'updateConfig',
						description: 'Update recording configuration',
						action: 'Update recording configuration',
					},
				],
				default: 'getConfig',
			},
			// Storage Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['storage'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new storage machine',
						action: 'Create storage machine',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a storage machine',
						action: 'Delete storage machine',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a storage machine',
						action: 'Get storage machine',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many storage machines',
						action: 'Get many storage machines',
					},
					{
						name: 'Test',
						value: 'test',
						description: 'Test storage connection',
						action: 'Test storage connection',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a storage machine',
						action: 'Update storage machine',
					},
				],
				default: 'getAll',
			},
			// Simulcast Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['simulcast'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new simulcast',
						action: 'Create simulcast',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a simulcast',
						action: 'Delete simulcast',
					},
					{
						name: 'Disable',
						value: 'disable',
						description: 'Disable a simulcast',
						action: 'Disable simulcast',
					},
					{
						name: 'Enable',
						value: 'enable',
						description: 'Enable a simulcast',
						action: 'Enable simulcast',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a simulcast',
						action: 'Get simulcast',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many simulcasts for a channel',
						action: 'Get many simulcasts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a simulcast',
						action: 'Update simulcast',
					},
				],
				default: 'getAll',
			},
			// Restrictions Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['restrictions'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get channel restrictions',
						action: 'Get restrictions',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update channel restrictions',
						action: 'Update restrictions',
					},
					{
						name: 'Update Password',
						value: 'updatePassword',
						description: 'Update restriction password',
						action: 'Update restriction password',
					},
				],
				default: 'get',
			},
			// Statistics Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['statistics'],
					},
				},
				options: [
					{
						name: 'Export CSV',
						value: 'exportCsv',
						description: 'Export statistics as CSV',
						action: 'Export statistics as CSV',
					},
					{
						name: 'Get Browser Share',
						value: 'getBrowserShare',
						description: 'Get browser usage share for a channel',
						action: 'Get browser share',
					},
					{
						name: 'Get Channel Clusters',
						value: 'getChannelClusters',
						description: 'Get channel geolocation by clusters',
						action: 'Get channel clusters',
					},
					{
						name: 'Get Channel Consumption',
						value: 'getChannelConsumption',
						description: 'Get channel consumption statistics',
						action: 'Get channel consumption',
					},
					{
						name: 'Get Channel Consumption by Resolution Histogram',
						value: 'getChannelConsumptionByResolutionHistogram',

						action: 'Get channel consumption by resolution histogram',
					},
					{
						name: 'Get Channel Countries',
						value: 'getChannelCountries',
						description: 'Get channel geolocation by countries',
						action: 'Get channel countries',
					},
					{
						name: 'Get Channel Unique Viewers',
						value: 'getChannelUniqueViewers',

						action: 'Get channel unique viewers',
					},
					{
						name: 'Get Channel Viewers',
						value: 'getChannelViewers',
						description: 'Get channel viewers statistics',
						action: 'Get channel viewers',
					},
					{
						name: 'Get Channel Viewers by Resolution Histogram',
						value: 'getChannelViewersByResolutionHistogram',

						action: 'Get channel viewers by resolution histogram',
					},
					{
						name: 'Get Channel Viewers by Resolution Share',
						value: 'getChannelViewersByResolutionShare',

						action: 'Get channel viewers by resolution share',
					},
					{
						name: 'Get Channel Viewers Histogram',
						value: 'getChannelViewersHistogram',

						action: 'Get channel viewers histogram',
					},
					{
						name: 'Get Channel Viewing',
						value: 'getChannelViewing',
						description: 'Get channel viewing time statistics',
						action: 'Get channel viewing',
					},
					{
						name: 'Get Channel Viewing by Resolution Histogram',
						value: 'getChannelViewingByResolutionHistogram',

						action: 'Get channel viewing by resolution histogram',
					},
					{
						name: 'Get Clusters',
						value: 'getClusters',
						description: 'Get account geolocation by clusters',
						action: 'Get clusters',
					},
					{
						name: 'Get Consumption',
						value: 'getConsumption',
						description: 'Get account consumption statistics',
						action: 'Get consumption',
					},
					{
						name: 'Get Consumption by Channel Histogram',
						value: 'getConsumptionByChannelHistogram',

						action: 'Get consumption by channel histogram',
					},
					{
						name: 'Get Countries',
						value: 'getCountries',
						description: 'Get account geolocation by countries',
						action: 'Get countries',
					},
					{
						name: 'Get OS Share',
						value: 'getOsShare',
						description: 'Get operating system usage share for a channel',
						action: 'Get OS share',
					},
					{
						name: 'Get Player Share',
						value: 'getPlayerShare',
						description: 'Get player usage share for a channel',
						action: 'Get player share',
					},
					{
						name: 'Get Unique Viewers',
						value: 'getUniqueViewers',
						description: 'Get account unique viewers',
						action: 'Get unique viewers',
					},
					{
						name: 'Get Viewers',
						value: 'getViewers',
						description: 'Get account viewers statistics',
						action: 'Get viewers',
					},
					{
						name: 'Get Viewers by Channel Histogram',
						value: 'getViewersByChannelHistogram',

						action: 'Get viewers by channel histogram',
					},
					{
						name: 'Get Viewers by Channel Share',
						value: 'getViewersByChannelShare',

						action: 'Get viewers by channel share',
					},
					{
						name: 'Get Viewers Histogram',
						value: 'getViewersHistogram',
						description: 'Get account viewers histogram',
						action: 'Get viewers histogram',
					},
					{
						name: 'Get Viewing',
						value: 'getViewing',
						description: 'Get account viewing time statistics',
						action: 'Get viewing',
					},
					{
						name: 'Get Viewing by Channel Histogram',
						value: 'getViewingByChannelHistogram',

						action: 'Get viewing by channel histogram',
					},
				],
				default: 'getConsumption',
			},
			// Integration Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['integration'],
					},
				},
				options: [
					{
						name: 'Get Channel Code',
						value: 'getChannelCode',
						description: 'Get channel integration code',
						action: 'Get channel integration code',
					},
					{
						name: 'Get Player Embed Code',
						value: 'getPlayerEmbedCode',

						action: 'Get player embed code',
					},
					{
						name: 'Get Player Embed URL',
						value: 'getPlayerEmbedUrl',

						action: 'Get player embed URL',
					},
				],
				default: 'getChannelCode',
			},
			// Options Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['options'],
					},
				},
				options: [
					{
						name: 'Create Timeshift',
						value: 'createTimeshift',
						description: 'Create timeshift configuration',
						action: 'Create timeshift configuration',
					},
					{
						name: 'Disable Watermark',
						value: 'disableWatermark',

						action: 'Disable watermark',
					},
					{
						name: 'Enable Watermark',
						value: 'enableWatermark',

						action: 'Enable watermark',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an option',
						action: 'Get option',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many options',
						action: 'Get many options',
					},
					{
						name: 'Get Timeshift',
						value: 'getTimeshift',
						description: 'Get timeshift configuration',
						action: 'Get timeshift configuration',
					},
					{
						name: 'Get Watermark',
						value: 'getWatermark',
						description: 'Get watermark configuration',
						action: 'Get watermark configuration',
					},
					{
						name: 'Recommit',
						value: 'recommit',
						description: 'Recommit an option',
						action: 'Recommit option',
					},
					{
						name: 'Terminate',
						value: 'terminate',
						description: 'Terminate an option',
						action: 'Terminate option',
					},
					{
						name: 'Update Timeshift',
						value: 'updateTimeshift',
						description: 'Update timeshift configuration',
						action: 'Update timeshift configuration',
					},
					{
						name: 'Update Watermark',
						value: 'updateWatermark',
						description: 'Update watermark configuration',
						action: 'Update watermark configuration',
					},
				],
				default: 'getAll',
			},
			// Channel Identifier
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['channel', 'event', 'live', 'recording', 'simulcast', 'restrictions', 'options'],
						operation: [
							'get', 'update', 'delete', 'getThumbnail', 'configureEncoding',
							'start', 'stop',
							'getConfig', 'createConfig', 'updateConfig', 'startInstant', 'stopInstant',
							'updatePassword',
							'getTimeshift', 'createTimeshift', 'updateTimeshift',
							'getWatermark', 'updateWatermark', 'enableWatermark', 'disableWatermark',
						],
					},
				},
				description: 'The channel identifier',
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event', 'simulcast'],
						operation: ['getAll', 'create'],
					},
				},
				description: 'The channel identifier',
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['integration'],
						operation: ['getChannelCode'],
					},
				},
				description: 'The channel identifier',
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['statistics'],
						operation: [
							'getChannelConsumption', 'getChannelConsumptionByResolutionHistogram',
							'getChannelViewers', 'getChannelUniqueViewers', 'getChannelViewersHistogram',
							'getChannelViewersByResolutionShare', 'getChannelViewersByResolutionHistogram',
							'getChannelViewing', 'getChannelViewingByResolutionHistogram',
							'getChannelCountries', 'getChannelClusters',
							'getBrowserShare', 'getOsShare', 'getPlayerShare',
						],
					},
				},
				description: 'The channel identifier',
			},
			// Player Identifier
			{
				displayName: 'Player',
				name: 'player',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['get', 'update', 'copy', 'delete', 'getThumbnail'],
					},
				},
				description: 'The player identifier',
			},
			{
				displayName: 'Player',
				name: 'player',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['integration'],
						operation: ['getPlayerEmbedCode', 'getPlayerEmbedUrl'],
					},
				},
				description: 'The player identifier',
			},
			// Other Identifiers
			{
				displayName: 'Event',
				name: 'event',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The event identifier',
			},
			{
				displayName: 'Ads',
				name: 'ads',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['ads'],
						operation: ['get', 'update', 'duplicate', 'delete'],
					},
				},
				description: 'The ads configuration identifier',
			},
			{
				displayName: 'Storage',
				name: 'storage',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['get', 'update', 'delete', 'test'],
					},
				},
				description: 'The storage machine identifier',
			},
			{
				displayName: 'Simulcast',
				name: 'simulcast',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['simulcast'],
						operation: ['get', 'update', 'delete', 'enable', 'disable'],
					},
				},
				description: 'The simulcast identifier',
			},
			{
				displayName: 'Option',
				name: 'option',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['options'],
						operation: ['get', 'recommit', 'terminate'],
					},
				},
				description: 'The option identifier',
			},
			// Return All / Limit
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['channel', 'player', 'ads', 'storage', 'event', 'simulcast', 'options'],
						operation: ['getAll'],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				displayOptions: {
					show: {
						resource: ['channel', 'player', 'ads', 'storage', 'event', 'simulcast', 'options'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},
			// Channel Create/Update Parameters
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['channel', 'player', 'event', 'simulcast', 'storage'],
						operation: ['create'],
					},
				},

			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Channel description',
					},
					{
						displayName: 'Encoding Profile',
						name: 'encodingProfile',
						type: 'string',
						default: '',
						description: 'Encoding profile identifier',
					},
					{
						displayName: 'Slug',
						name: 'slug',
						type: 'string',
						default: '',
						description: 'URL-friendly identifier',
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
						resource: ['channel'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Channel description',
					},
					{
						displayName: 'Encoding Profile',
						name: 'encodingProfile',
						type: 'string',
						default: '',
						description: 'Encoding profile identifier',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Channel name',
					},
					{
						displayName: 'Slug',
						name: 'slug',
						type: 'string',
						default: '',
						description: 'URL-friendly identifier',
					},
				],
			},
			{
				displayName: 'Encoding Profile',
				name: 'encodingProfile',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['configureEncoding'],
					},
				},
				description: 'Encoding profile identifier',
			},
			// Player Create/Update Parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['create', 'copy'],
					},
				},
				options: [
					{
						displayName: 'Autoplay',
						name: 'autoplay',
						type: 'boolean',
						default: false,
						description: 'Whether to enable autoplay',
					},
					{
						displayName: 'Channel ID',
						name: 'channelId',
						type: 'string',
						default: '',
						description: 'Associated channel identifier',
					},
					{
						displayName: 'Controls',
						name: 'controls',
						type: 'boolean',
						default: true,
						description: 'Whether to show player controls',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Player name (for copy operation)',
					},
					{
						displayName: 'Slug',
						name: 'slug',
						type: 'string',
						default: '',
						description: 'URL-friendly identifier',
					},
					{
						displayName: 'Theme',
						name: 'theme',
						type: 'string',
						default: '',
						description: 'Player theme',
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
						resource: ['player'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Autoplay',
						name: 'autoplay',
						type: 'boolean',
						default: false,
						description: 'Whether to enable autoplay',
					},
					{
						displayName: 'Channel ID',
						name: 'channelId',
						type: 'string',
						default: '',
						description: 'Associated channel identifier',
					},
					{
						displayName: 'Controls',
						name: 'controls',
						type: 'boolean',
						default: true,
						description: 'Whether to show player controls',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Player name',
					},
					{
						displayName: 'Slug',
						name: 'slug',
						type: 'string',
						default: '',
						description: 'URL-friendly identifier',
					},
					{
						displayName: 'Theme',
						name: 'theme',
						type: 'string',
						default: '',
						description: 'Player theme',
					},
				],
			},
			// Event Create/Update Parameters
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['create'],
					},
				},
				description: 'Event start time (ISO 8601 format)',
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['create'],
					},
				},
				description: 'Event end time (ISO 8601 format)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Event description',
					},
					{
						displayName: 'Repeat Pattern',
						name: 'repeatPattern',
						type: 'options',
						options: [
							{ name: 'Daily', value: 'daily' },
							{ name: 'Monthly', value: 'monthly' },
							{ name: 'Weekly', value: 'weekly' },
						],
						default: 'daily',
						description: 'Repeat pattern for the event',
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
						resource: ['event'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Event description',
					},
					{
						displayName: 'End Time',
						name: 'endTime',
						type: 'string',
						default: '',
						description: 'Event end time (ISO 8601 format)',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Event name',
					},
					{
						displayName: 'Repeat Pattern',
						name: 'repeatPattern',
						type: 'options',
						options: [
							{ name: 'Daily', value: 'daily' },
							{ name: 'Monthly', value: 'monthly' },
							{ name: 'Weekly', value: 'weekly' },
						],
						default: 'daily',
						description: 'Repeat pattern for the event',
					},
					{
						displayName: 'Start Time',
						name: 'startTime',
						type: 'string',
						default: '',
						description: 'Event start time (ISO 8601 format)',
					},
				],
			},
			// Ads Create/Update Parameters
			{
				displayName: 'Player ID',
				name: 'playerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['ads'],
						operation: ['create'],
					},
				},
				description: 'The player identifier',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['ads'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether ads are enabled',
					},
					{
						displayName: 'Midroll Interval',
						name: 'midrollInterval',
						type: 'number',
						default: 300,
						description: 'Midroll ad interval in seconds',
					},
					{
						displayName: 'Midroll URL',
						name: 'midrollUrl',
						type: 'string',
						default: '',
						description: 'Midroll ad URL',
					},
					{
						displayName: 'Postroll URL',
						name: 'postrollUrl',
						type: 'string',
						default: '',
						description: 'Postroll ad URL',
					},
					{
						displayName: 'Preroll URL',
						name: 'prerollUrl',
						type: 'string',
						default: '',
						description: 'Preroll ad URL',
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
						resource: ['ads'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether ads are enabled',
					},
					{
						displayName: 'Midroll Interval',
						name: 'midrollInterval',
						type: 'number',
						default: 300,
						description: 'Midroll ad interval in seconds',
					},
					{
						displayName: 'Midroll URL',
						name: 'midrollUrl',
						type: 'string',
						default: '',
						description: 'Midroll ad URL',
					},
					{
						displayName: 'Postroll URL',
						name: 'postrollUrl',
						type: 'string',
						default: '',
						description: 'Postroll ad URL',
					},
					{
						displayName: 'Preroll URL',
						name: 'prerollUrl',
						type: 'string',
						default: '',
						description: 'Preroll ad URL',
					},
				],
			},
			// Recording Create/Update Parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['createConfig'],
					},
				},
				options: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether recording is enabled',
					},
					{
						displayName: 'Retention Days',
						name: 'retentionDays',
						type: 'number',
						default: 30,
						description: 'Number of days to retain recordings',
					},
					{
						displayName: 'Storage Machine ID',
						name: 'storageMachineId',
						type: 'string',
						default: '',
						description: 'Storage machine identifier',
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
						resource: ['recording'],
						operation: ['updateConfig'],
					},
				},
				options: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether recording is enabled',
					},
					{
						displayName: 'Retention Days',
						name: 'retentionDays',
						type: 'number',
						default: 30,
						description: 'Number of days to retain recordings',
					},
					{
						displayName: 'Storage Machine ID',
						name: 'storageMachineId',
						type: 'string',
						default: '',
						description: 'Storage machine identifier',
					},
				],
			},
			// Storage Create/Update Parameters
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				required: true,
				options: [
					{ name: 'FTP', value: 'ftp' },
					{ name: 'S3', value: 's3' },
					{ name: 'SFTP', value: 'sftp' },
				],
				default: 'ftp',
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['create'],
					},
				},
				description: 'Storage type',
			},
			{
				displayName: 'Host',
				name: 'host',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['create'],
					},
				},
				description: 'Storage host address',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Storage password',
					},
					{
						displayName: 'Path',
						name: 'path',
						type: 'string',
						default: '',
						description: 'Storage path',
					},
					{
						displayName: 'Port',
						name: 'port',
						type: 'number',
						default: 21,
						description: 'Storage port',
					},
					{
						displayName: 'Username',
						name: 'username',
						type: 'string',
						default: '',
						description: 'Storage username',
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
						resource: ['storage'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Host',
						name: 'host',
						type: 'string',
						default: '',
						description: 'Storage host address',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Storage machine name',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Storage password',
					},
					{
						displayName: 'Path',
						name: 'path',
						type: 'string',
						default: '',
						description: 'Storage path',
					},
					{
						displayName: 'Port',
						name: 'port',
						type: 'number',
						default: 21,
						description: 'Storage port',
					},
					{
						displayName: 'Username',
						name: 'username',
						type: 'string',
						default: '',
						description: 'Storage username',
					},
				],
			},
			// Simulcast Create/Update Parameters
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['simulcast'],
						operation: ['create'],
					},
				},
				description: 'Simulcast platform (e.g., YouTube, Facebook, Twitch)',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['simulcast'],
						operation: ['create'],
					},
				},
				description: 'Simulcast RTMP URL',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['simulcast'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether simulcast is enabled',
					},
					{
						displayName: 'Stream Key',
						name: 'streamKey',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Stream key for the platform',
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
						resource: ['simulcast'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether simulcast is enabled',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Simulcast name',
					},
					{
						displayName: 'Platform',
						name: 'platform',
						type: 'string',
						default: '',
						description: 'Simulcast platform',
					},
					{
						displayName: 'Stream Key',
						name: 'streamKey',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Stream key for the platform',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						description: 'Simulcast RTMP URL',
					},
				],
			},
			// Restrictions Update Parameters
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['restrictions'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Allowed Countries',
						name: 'allowedCountries',
						type: 'string',
						default: '',
						description: 'Comma-separated list of allowed country codes',
					},
					{
						displayName: 'Allowed Domains',
						name: 'allowedDomains',
						type: 'string',
						default: '',
						description: 'Comma-separated list of allowed domains',
					},
					{
						displayName: 'Blocked Countries',
						name: 'blockedCountries',
						type: 'string',
						default: '',
						description: 'Comma-separated list of blocked country codes',
					},
					{
						displayName: 'Domain Restriction Enabled',
						name: 'domainRestrictionEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether domain restriction is enabled',
					},
					{
						displayName: 'Geo Restriction Enabled',
						name: 'geoRestrictionEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether geo restriction is enabled',
					},
					{
						displayName: 'Password Enabled',
						name: 'passwordEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether password protection is enabled',
					},
				],
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['restrictions'],
						operation: ['updatePassword'],
					},
				},
				description: 'New password for restriction',
			},
			// Statistics Parameters
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['statistics'],
					},
				},
				description: 'Start date (YYYY-MM-DD format)',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['statistics'],
					},
				},
				description: 'End date (YYYY-MM-DD format)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['statistics'],
						operation: [
							'getConsumption', 'getConsumptionByChannelHistogram',
							'getViewersHistogram', 'getViewersByChannelHistogram',
							'getViewingByChannelHistogram',
							'getChannelConsumption', 'getChannelConsumptionByResolutionHistogram',
							'getChannelViewersHistogram', 'getChannelViewersByResolutionHistogram',
							'getChannelViewingByResolutionHistogram',
							'exportCsv',
						],
					},
				},
				options: [
					{
						displayName: 'Channel',
						name: 'channel',
						type: 'string',
						default: '',
						description: 'Filter by channel (for export)',
					},
					{
						displayName: 'Period',
						name: 'per',
						type: 'options',
						options: [
							{ name: 'Day', value: 'day' },
							{ name: 'Hour', value: 'hour' },
							{ name: 'Month', value: 'month' },
							{ name: 'Week', value: 'week' },
						],
						default: 'day',
						description: 'Time period for histogram data',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'string',
						default: '',
						description: 'Type of statistics to export',
					},
				],
			},
			// Integration Parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['integration'],
						operation: ['getPlayerEmbedCode', 'getPlayerEmbedUrl'],
					},
				},
				options: [
					{
						displayName: 'Autoplay',
						name: 'autoplay',
						type: 'boolean',
						default: false,
						description: 'Whether to enable autoplay',
					},
					{
						displayName: 'Height',
						name: 'height',
						type: 'number',
						default: 360,
						description: 'Player height in pixels',
					},
					{
						displayName: 'Width',
						name: 'width',
						type: 'number',
						default: 640,
						description: 'Player width in pixels',
					},
				],
			},
			// Options Parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['options'],
						operation: ['createTimeshift'],
					},
				},
				options: [
					{
						displayName: 'Duration Minutes',
						name: 'durationMinutes',
						type: 'number',
						default: 60,
						description: 'Timeshift duration in minutes',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether timeshift is enabled',
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
						resource: ['options'],
						operation: ['updateTimeshift'],
					},
				},
				options: [
					{
						displayName: 'Duration Minutes',
						name: 'durationMinutes',
						type: 'number',
						default: 60,
						description: 'Timeshift duration in minutes',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether timeshift is enabled',
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
						resource: ['options'],
						operation: ['updateWatermark'],
					},
				},
				options: [
					{
						displayName: 'Image URL',
						name: 'imageUrl',
						type: 'string',
						default: '',
						description: 'Watermark image URL',
					},
					{
						displayName: 'Opacity',
						name: 'opacity',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 100,
						},
						default: 50,
						description: 'Watermark opacity (0-100)',
					},
					{
						displayName: 'Position',
						name: 'position',
						type: 'options',
						options: [
							{ name: 'Bottom Left', value: 'bottom-left' },
							{ name: 'Bottom Right', value: 'bottom-right' },
							{ name: 'Top Left', value: 'top-left' },
							{ name: 'Top Right', value: 'top-right' },
						],
						default: 'bottom-right',
						description: 'Watermark position',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Resource handler mapping
		const resourceHandlers: Record<
			string,
			(context: IExecuteFunctions, operation: string, itemIndex: number) => Promise<INodeExecutionData[]>
		> = {
			channel: ChannelResource.execute,
			live: LiveResource.execute,
			event: EventResource.execute,
			player: PlayerResource.execute,
			ads: AdsResource.execute,
			recording: RecordingResource.execute,
			storage: StorageResource.execute,
			simulcast: SimulcastResource.execute,
			restrictions: RestrictionsResource.execute,
			statistics: StatisticsResource.execute,
			integration: IntegrationResource.execute,
			options: OptionsResource.execute,
		};

		// Execute operations for each item
		for (let i = 0; i < items.length; i++) {
			try {
				const handler = resourceHandlers[resource];

				if (!handler) {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				// Execute the resource handler
				const result = await handler(this, operation, i);
				returnData.push(...result);
			} catch (error) {
				// Handle errors based on continueOnFail setting
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
