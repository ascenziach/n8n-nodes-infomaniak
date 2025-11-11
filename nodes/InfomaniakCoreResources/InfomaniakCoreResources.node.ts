import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import {
	ActionResource,
	CountryResource,
	EventResource,
	LanguageResource,
	ProductResource,
	ProfileResource,
	TaskResource,
	TimezoneResource,
	UserManagementResource,
	KSuiteResource,
} from './resources';

export class InfomaniakCoreResources implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak CoreResources',
		name: 'infomaniakCoreResources',
		icon: 'file:InfomaniakCoreResources.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infomaniak API - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak CoreResources',
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
						name: 'Action',
						value: 'action',
						description: 'Manage actions in Infomaniak',
					},
					{
						name: 'Country',
						value: 'country',
						description: 'Manage countries in Infomaniak',
					},
					{
						name: 'Event',
						value: 'event',
						description: 'Manage events in Infomaniak',
					},
					{
						name: 'Language',
						value: 'language',
						description: 'Manage languages in Infomaniak',
					},
					{
						name: 'Product',
						value: 'product',
						description: 'Manage products in Infomaniak',
					},
					{
						name: 'Profile',
						value: 'profile',
						description: 'Manage user profile and sub-resources',
					},
					{
						name: 'Task',
						value: 'task',
						description: 'Manage asynchronous tasks',
					},
					{
						name: 'Timezone',
						value: 'timezone',
						description: 'Manage timezones',
					},
					{
						name: 'User Management',
						value: 'userManagement',
						description: 'Manage users, accounts, teams and invitations',
					},
					{
						name: 'kSuite',
						value: 'kSuite',
						description: 'Manage kSuite workspaces, mailboxes and products',
					},
				],
				default: 'action',
			},
			// Action Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['action'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many available actions',
						action: 'Get many actions',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific action by ID',
						action: 'Get an action',
					},
				],
				default: 'getAll',
			},
			// Country Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['country'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many available countries',
						action: 'Get many countries',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific country by ID',
						action: 'Get a country',
					},
				],
				default: 'getAll',
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
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many events',
						action: 'Get many events',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific event by ID',
						action: 'Get an event',
					},
					{
						name: 'Get Public Cloud Status',
						value: 'getPublicCloudStatus',

						action: 'Get public cloud status',
					},
				],
				default: 'getAll',
			},
			// Language Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['language'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many available languages',
						action: 'Get many languages',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific language by ID',
						action: 'Get a language',
					},
				],
				default: 'getAll',
			},
			// Product Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['product'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many products where user has rights',
						action: 'Get many products',
					},
				],
				default: 'getAll',
			},
			// Profile Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['profile'],
					},
				},
				options: [
					{
						name: 'Get Profile',
						value: 'get',
						description: 'Get current user profile information',
						action: 'Get profile',
					},
					{
						name: 'Update Profile',
						value: 'update',
						description: 'Update current user profile information',
						action: 'Update profile',
					},
					{
						name: 'Upload Avatar',
						value: 'uploadAvatar',
						description: 'Add or update profile avatar',
						action: 'Upload avatar',
					},
					{
						name: 'Delete Avatar',
						value: 'deleteAvatar',
						description: 'Delete profile avatar',
						action: 'Delete avatar',
					},
					{
						name: 'Get Application Passwords',
						value: 'getAppPasswords',
						description: 'Get all application passwords',
						action: 'Get application passwords',
					},
					{
						name: 'Create Application Password',
						value: 'createAppPassword',
						description: 'Create a new application password',
						action: 'Create application password',
					},
					{
						name: 'Get Application Password',
						value: 'getAppPassword',
						description: 'Get specific application password by ID',
						action: 'Get application password',
					},
					{
						name: 'Get Profile Emails',
						value: 'getEmails',
						description: 'Get all profile email addresses',
						action: 'Get profile emails',
					},
					{
						name: 'Get Profile Email',
						value: 'getEmail',
						description: 'Get specific profile email by type and ID',
						action: 'Get profile email',
					},
					{
						name: 'Delete Profile Email',
						value: 'deleteEmail',
						description: 'Delete profile email by type and ID',
						action: 'Delete profile email',
					},
					{
						name: 'Get Profile Phones',
						value: 'getPhones',
						description: 'Get all profile phone numbers',
						action: 'Get profile phones',
					},
					{
						name: 'Get Profile Phone',
						value: 'getPhone',
						description: 'Get specific profile phone by ID',
						action: 'Get profile phone',
					},
					{
						name: 'Delete Profile Phone',
						value: 'deletePhone',
						description: 'Delete profile phone by ID',
						action: 'Delete profile phone',
					},
				],
				default: 'get',
			},
			// Get All Actions parameters
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['action'],
						operation: ['getAll'],
					},
				},
				description: 'Search term to filter actions',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['action'],
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
						resource: ['action'],
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
			// Get Action by ID parameters
			{
				displayName: 'Action ID',
				name: 'actionId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['action'],
						operation: ['get'],
					},
				},
				description: 'The unique identifier of the action',
			},
			// Get All Countries parameters
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['country'],
						operation: ['getAll'],
					},
				},
				description: 'Search countries by name or code',
			},
			{
				displayName: 'Only Enabled',
				name: 'onlyEnabled',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['country'],
						operation: ['getAll'],
					},
				},
				description: 'Filter to show only enabled countries',
			},
			{
				displayName: 'Only Enabled Exception',
				name: 'onlyEnabledException',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['country'],
						operation: ['getAll'],
						onlyEnabled: [true],
					},
				},
				description: 'Comma-separated list of country IDs to include even if disabled',
				placeholder: 'e.g., 1,2,3',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['country'],
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
						resource: ['country'],
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
			// Get Country by ID parameters
			{
				displayName: 'Country ID',
				name: 'countryId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['country'],
						operation: ['get'],
					},
				},
				description: 'The unique identifier of the country',
			},
			// Pagination parameters for Countries
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['country'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Order By',
						name: 'orderBy',
						type: 'options',
						options: [
							{
								name: 'ID',
								value: 'id',
							},
							{
								name: 'Name',
								value: 'name',
							},
							{
								name: 'Code',
								value: 'code',
							},
						],
						default: 'name',
						description: 'Field to order results by',
					},
					{
						displayName: 'Order Direction',
						name: 'order',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'asc',
							},
							{
								name: 'Descending',
								value: 'desc',
							},
						],
						default: 'asc',
						description: 'Order direction for results',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Per Page',
						name: 'perPage',
						type: 'number',
						default: 50,
						description: 'Number of results per page',
					},
				],
			},
			// Event parameters - Get All
			{
				displayName: 'Event Filters',
				name: 'eventFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Date From',
						name: 'dateFrom',
						type: 'dateTime',
						default: '',
						description: 'Filter events starting from this date',
					},
					{
						displayName: 'Date To',
						name: 'dateTo',
						type: 'dateTime',
						default: '',
						description: 'Filter events up to this date',
					},
					{
						displayName: 'Event Type',
						name: 'eventType',
						type: 'options',
						options: [
							{
								name: 'Internal',
								value: 'internal',
							},
							{
								name: 'Public',
								value: 'public',
							},
							{
								name: 'Server',
								value: 'server',
							},
							{
								name: 'Streaming',
								value: 'streaming',
							},
						],
						default: 'internal',
						description: 'Filter by event type',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'In Progress',
								value: 'inprogress',
							},
							{
								name: 'Planned',
								value: 'planned',
							},
							{
								name: 'Reviewed',
								value: 'reviewed',
							},
							{
								name: 'Terminated',
								value: 'terminated',
							},
						],
						default: 'inprogress',
						description: 'Filter by event status',
					},
					{
						displayName: 'Locale',
						name: 'locale',
						type: 'options',
						options: [
							{
								name: 'German',
								value: 'de',
							},
							{
								name: 'English',
								value: 'en',
							},
							{
								name: 'Spanish',
								value: 'es',
							},
							{
								name: 'French',
								value: 'fr',
							},
							{
								name: 'Italian',
								value: 'it',
							},
						],
						default: 'en',
						description: 'Language for event descriptions',
					},
					{
						displayName: 'Is Cyber Attack',
						name: 'isCyberattack',
						type: 'boolean',
						default: false,
						description: 'Filter for cyber attack events',
					},
					{
						displayName: 'Show Auto',
						name: 'showAuto',
						type: 'boolean',
						default: false,
						description: 'Show automatic events',
					},
					{
						displayName: 'With Trashed',
						name: 'withTrashed',
						type: 'boolean',
						default: false,
						description: 'Include deleted events',
					},
					{
						displayName: 'User ID',
						name: 'userId',
						type: 'number',
						default: '',
						description: 'Filter by user ID',
					},
				],
			},
			// Get Event by ID parameter
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get'],
					},
				},
				description: 'The unique identifier of the event',
			},
			// Language parameters - Get All
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['language'],
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
						resource: ['language'],
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
			// Language pagination options
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['language'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Order By',
						name: 'orderBy',
						type: 'options',
						options: [
							{
								name: 'ID',
								value: 'id',
							},
							{
								name: 'Name',
								value: 'name',
							},
							{
								name: 'Code',
								value: 'code',
							},
						],
						default: 'name',
						description: 'Field to order results by',
					},
					{
						displayName: 'Order Direction',
						name: 'order',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'asc',
							},
							{
								name: 'Descending',
								value: 'desc',
							},
						],
						default: 'asc',
						description: 'Order direction for results',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Per Page',
						name: 'perPage',
						type: 'number',
						default: 50,
						description: 'Number of results per page',
					},
					{
						displayName: 'Skip',
						name: 'skip',
						type: 'number',
						default: 0,
						description: 'Number of items to skip',
					},
					{
						displayName: 'Return Total Count',
						name: 'returnTotal',
						type: 'boolean',
						default: false,
						description: 'Return only the total count instead of items',
					},
				],
			},
			// Get Language by ID parameter
			{
				displayName: 'Language ID',
				name: 'languageId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['language'],
						operation: ['get'],
					},
				},
				description: 'The unique identifier of the language',
			},
			// Product parameters - Filters
			{
				displayName: 'Product Filters',
				name: 'productFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Account ID',
						name: 'accountId',
						type: 'number',
						default: '',
						description: 'Filter by account identifier',
					},
					{
						displayName: 'Customer Name',
						name: 'customerName',
						type: 'string',
						default: '',
						description: 'Filter by customer name',
					},
					{
						displayName: 'FQDN',
						name: 'fqdn',
						type: 'string',
						default: '',
						description: 'Filter by fully qualified domain name',
					},
					{
						displayName: 'Internal Name',
						name: 'internalName',
						type: 'string',
						default: '',
						description: 'Filter by internal name',
					},
					{
						displayName: 'Product ID',
						name: 'productId',
						type: 'number',
						default: '',
						description: 'Filter by product identifier',
					},
					{
						displayName: 'Service ID',
						name: 'serviceId',
						type: 'options',
						options: [
							{ name: '1', value: 1 },
							{ name: '2', value: 2 },
							{ name: '3', value: 3 },
							{ name: '4', value: 4 },
							{ name: '6', value: 6 },
							{ name: '7', value: 7 },
							{ name: '10', value: 10 },
							{ name: '14', value: 14 },
							{ name: '15', value: 15 },
							{ name: '18', value: 18 },
							{ name: '23', value: 23 },
							{ name: '25', value: 25 },
							{ name: '26', value: 26 },
							{ name: '29', value: 29 },
							{ name: '30', value: 30 },
							{ name: '31', value: 31 },
							{ name: '34', value: 34 },
							{ name: '35', value: 35 },
							{ name: '37', value: 37 },
							{ name: '40', value: 40 },
							{ name: '43', value: 43 },
							{ name: '48', value: 48 },
							{ name: '50', value: 50 },
							{ name: '52', value: 52 },
							{ name: '58', value: 58 },
						],
						default: 1,
						description: 'Filter by service ID',
					},
					{
						displayName: 'Service Name',
						name: 'serviceName',
						type: 'options',
						options: [
							{ name: 'AI Tools', value: 'ai_tools' },
							{ name: 'Backup', value: 'backup' },
							{ name: 'Certificate', value: 'certificate' },
							{ name: 'Cloud', value: 'cloud' },
							{ name: 'Cloud HD', value: 'cloud_hd' },
							{ name: 'Custom URL', value: 'custom_url' },
							{ name: 'Dedicated Server', value: 'dedicated_server' },
							{ name: 'Domain', value: 'domain' },
							{ name: 'Drive', value: 'drive' },
							{ name: 'E-Ticketing', value: 'e_ticketing' },
							{ name: 'Email Hosting', value: 'email_hosting' },
							{ name: 'Hosting', value: 'hosting' },
							{ name: 'Housing', value: 'housing' },
							{ name: 'Invitation', value: 'invitation' },
							{ name: 'Jelastic', value: 'jelastic' },
							{ name: 'kSuite', value: 'ksuite' },
							{ name: 'Mailing', value: 'mailing' },
							{ name: 'NAS', value: 'nas' },
							{ name: 'Public Cloud', value: 'public_cloud' },
							{ name: 'Radio', value: 'radio' },
							{ name: 'Swiss Backup', value: 'swiss_backup' },
							{ name: 'Video', value: 'video' },
							{ name: 'VOD', value: 'vod' },
							{ name: 'Web Hosting', value: 'web_hosting' },
							{ name: 'Website Builder', value: 'website_builder' },
						],
						default: 'ai_tools',
						description: 'Filter by service name',
					},
				],
			},
			// Product pagination and options
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['product'],
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
						resource: ['product'],
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
			// Product additional options
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'With',
						name: 'with',
						type: 'string',
						default: '',
						description: 'Load additional data about resources',
					},
					{
						displayName: 'Order By',
						name: 'orderBy',
						type: 'string',
						default: '',
						description: 'Field used for sorting',
					},
					{
						displayName: 'Order Direction',
						name: 'order',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'asc',
							},
							{
								name: 'Descending',
								value: 'desc',
							},
						],
						default: 'asc',
						description: 'Sort order direction',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Per Page',
						name: 'perPage',
						type: 'number',
						default: 50,
						description: 'Number of results per page',
					},
					{
						displayName: 'Skip',
						name: 'skip',
						type: 'number',
						default: 0,
						description: 'Number of items to skip',
					},
					{
						displayName: 'Return Total Count',
						name: 'returnTotal',
						type: 'boolean',
						default: false,
						description: 'Return only the total count instead of items',
					},
				],
			},
			// Profile parameters
			{
				displayName: 'Profile Options',
				name: 'profileOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['get'],
					},
				},
				options: [
					{
						displayName: 'With',
						name: 'with',
						type: 'string',
						default: '',
						description: 'Load additional data about resources',
					},
				],
			},
			// Profile Update Parameters
			{
				displayName: 'Profile Update Data',
				name: 'profileData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'User email address (required)',

					},
					{
						displayName: 'First Name',
						name: 'firstname',
						type: 'string',
						default: '',
						description: 'User first name (max 128 chars)',
					},
					{
						displayName: 'Last Name',
						name: 'lastname',
						type: 'string',
						default: '',
						description: 'User last name (max 128 chars)',
					},
					{
						displayName: 'Country ID',
						name: 'countryId',
						type: 'number',
						default: '',
						description: 'Country identifier',
					},
					{
						displayName: 'Language ID',
						name: 'languageId',
						type: 'number',
						default: '',
						description: 'Language identifier',
					},
					{
						displayName: 'Locale',
						name: 'locale',
						type: 'string',
						default: '',
						description: 'User locale setting',
					},
					{
						displayName: 'Timezone',
						name: 'timezone',
						type: 'string',
						default: '',
						description: 'User timezone',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'New password',
					},
					{
						displayName: 'Current Password',
						name: 'currentPassword',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Current password for verification',
					},
				],
			},
			// Avatar parameters
			{
				displayName: 'Avatar Data',
				name: 'avatarData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['uploadAvatar'],
					},
				},
				options: [
					{
						displayName: 'Avatar',
						name: 'avatar',
						type: 'string',
						default: '',
						description: 'Base64 encoded avatar image',

					},
					{
						displayName: 'Encoding',
						name: 'encoding',
						type: 'string',
						default: 'base64',
						description: 'Encoding type for the avatar',
					},
				],
			},
			// Application Password ID parameter
			{
				displayName: 'Password ID',
				name: 'passwordId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['getAppPassword'],
					},
				},
				description: 'The unique identifier of the application password',
			},
			// Email parameters
			{
				displayName: 'Email Type',
				name: 'emailType',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'Email Request',
						value: 'email_request',
					},
				],
				default: 'email',
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['getEmail', 'deleteEmail'],
					},
				},
				description: 'Type of email to retrieve/delete',
			},
			{
				displayName: 'Email ID',
				name: 'emailId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['getEmail', 'deleteEmail'],
					},
				},
				description: 'The unique identifier of the email',
			},
			// Phone parameters
			{
				displayName: 'Phone ID',
				name: 'phoneId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['getPhone', 'deletePhone'],
					},
				},
				description: 'The unique identifier of the phone number',
			},
			// Task Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many tasks',
						action: 'Get many tasks',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific task by UUID',
						action: 'Get a task',
					},
				],
				default: 'getAll',
			},
			// Task parameters
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['task'],
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
						resource: ['task'],
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
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Return',
						name: 'return',
						type: 'options',
						options: [
							{
								name: 'Total',
								value: 'total',
								description: 'Return total count',
							},
						],
						default: 'total',
						description: 'Specify what to return',
					},
					{
						displayName: 'Skip',
						name: 'skip',
						type: 'number',
						default: 0,
						description: 'Number of items to skip',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Per Page',
						name: 'perPage',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 50,
						description: 'Number of items per page',
					},
					{
						displayName: 'Order By',
						name: 'orderBy',
						type: 'string',
						default: '',
						description: 'Field to order by',
					},
					{
						displayName: 'Order',
						name: 'order',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'asc',
							},
							{
								name: 'Descending',
								value: 'desc',
							},
						],
						default: 'asc',
						description: 'Order direction',
					},
					{
						displayName: 'Order For',
						name: 'orderFor',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'asc',
							},
							{
								name: 'Descending',
								value: 'desc',
							},
						],
						default: 'asc',
						description: 'Order direction for fields',
					},
				],
			},
			{
				displayName: 'Task UUID',
				name: 'taskUuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['get'],
					},
				},
				description: 'The unique identifier (UUID) of the task to request',
			},
			// Timezone Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['timezone'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many timezones',
						action: 'Get many timezones',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific timezone by ID',
						action: 'Get a timezone',
					},
				],
				default: 'getAll',
			},
			// Timezone parameters
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['timezone'],
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
						resource: ['timezone'],
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
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['timezone'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Search filter for timezones',
					},
					{
						displayName: 'Return',
						name: 'return',
						type: 'options',
						options: [
							{
								name: 'Total',
								value: 'total',
								description: 'Return total count',
							},
						],
						default: 'total',
						description: 'Specify what to return',
					},
					{
						displayName: 'Skip',
						name: 'skip',
						type: 'number',
						default: 0,
						description: 'Number of items to skip',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Per Page',
						name: 'perPage',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 50,
						description: 'Number of items per page',
					},
					{
						displayName: 'Order By',
						name: 'orderBy',
						type: 'string',
						default: '',
						description: 'Field to order by',
					},
					{
						displayName: 'Order',
						name: 'order',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'asc',
							},
							{
								name: 'Descending',
								value: 'desc',
							},
						],
						default: 'asc',
						description: 'Order direction',
					},
					{
						displayName: 'Order For',
						name: 'orderFor',
						type: 'json',
						default: '{}',
						description: 'Define the sorting order for a field (JSON object)',
					},
				],
			},
			{
				displayName: 'Timezone ID',
				name: 'timezoneId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['timezone'],
						operation: ['get'],
					},
				},
				description: 'The unique identifier of the timezone to request',
			},
			// User Management Operations
			{
				displayName: 'Sub Resource',
				name: 'subResource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
					},
				},
				options: [
					{
						name: 'Core',
						value: 'core',
						description: 'Core user management operations',
					},
					{
						name: 'Accounts',
						value: 'accounts',
						description: 'Account management operations',
					},
					{
						name: 'Teams',
						value: 'teams',
						description: 'Team management operations',
					},
				],
				default: 'core',
			},
			// User Management Core Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
					},
				},
				options: [
					{
						name: 'Invite User',
						value: 'inviteUser',
						description: 'Invite a user to an account',
						action: 'Invite a user',
					},
					{
						name: 'Cancel Invitation',
						value: 'cancelInvitation',
						description: 'Cancel an invitation',
						action: 'Cancel an invitation',
					},
				],
				default: 'inviteUser',
			},
			// User Management Accounts Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['accounts'],
					},
				},
				options: [
					{
						name: 'List Accounts',
						value: 'listAccounts',
						description: 'Get all accounts',
						action: 'List all accounts',
					},
					{
						name: 'Get Account',
						value: 'getAccount',
						description: 'Get a specific account by ID',
						action: 'Get an account',
					},
					{
						name: 'Get Account Tags',
						value: 'getAccountTags',

						action: 'Get account tags',
					},
					{
						name: 'List Account Products',
						value: 'listAccountProducts',

						action: 'List account products',
					},
					{
						name: 'List Account Services',
						value: 'listAccountServices',

						action: 'List account services',
					},
					{
						name: 'List Current Account Products',
						value: 'listCurrentAccountProducts',
						description: 'List products of current user account',
						action: 'List current account products',
					},
					{
						name: 'List Basic Teams',
						value: 'listBasicTeams',
						description: 'List basic teams information',
						action: 'List basic teams',
					},
					{
						name: 'List Users',
						value: 'listUsers',
						description: 'List account users',
						action: 'List users',
					},
					{
						name: 'List User App Accesses',
						value: 'listUserAppAccesses',

						action: 'List user app accesses',
					},
				],
				default: 'listAccounts',
			},
			// User Management Teams Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['teams'],
					},
				},
				options: [
					{
						name: 'List Teams',
						value: 'listTeams',
						description: 'Get all teams',
						action: 'List all teams',
					},
					{
						name: 'Create Team',
						value: 'createTeam',
						description: 'Create a new team',
						action: 'Create a team',
					},
					{
						name: 'Get Team',
						value: 'getTeam',
						description: 'Get a specific team',
						action: 'Get a team',
					},
					{
						name: 'Update Team',
						value: 'updateTeam',
						description: 'Update a team',
						action: 'Update a team',
					},
					{
						name: 'Delete Team',
						value: 'deleteTeam',
						description: 'Delete a team',
						action: 'Delete a team',
					},
					{
						name: 'List Team Users',
						value: 'listTeamUsers',

						action: 'List team users',
					},
					{
						name: 'Add Users To Team',
						value: 'addUsersToTeam',

						action: 'Add users to team',
					},
					{
						name: 'Remove Users From Team',
						value: 'removeUsersFromTeam',

						action: 'Remove users from team',
					},
				],
				default: 'listTeams',
			},
			// User Management Parameters
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
						operation: ['inviteUser', 'cancelInvitation'],
					},
				},
				default: '',
				description: 'The account identifier',
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['accounts'],
						operation: ['getAccount', 'getAccountTags', 'listAccountProducts', 'listAccountServices', 'listBasicTeams', 'listUsers', 'listUserAppAccesses'],
					},
				},
				default: '',
				description: 'The account identifier',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['accounts'],
						operation: ['listUserAppAccesses'],
					},
				},
				default: '',
				description: 'The user identifier',
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['teams'],
						operation: ['listTeams', 'createTeam', 'getTeam', 'updateTeam', 'deleteTeam'],
					},
				},
				default: '',
				description: 'The account identifier',
			},
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['teams'],
						operation: ['getTeam', 'updateTeam', 'deleteTeam', 'listTeamUsers', 'addUsersToTeam', 'removeUsersFromTeam'],
					},
				},
				default: '',
				description: 'The team identifier',
			},
			{
				displayName: 'Invitation ID',
				name: 'invitationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						operation: ['cancelInvitation'],
					},
				},
				default: '',
				description: 'The invitation identifier',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
						operation: ['inviteUser'],
					},
				},
				default: '',
				description: 'Email address of the user to invite',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
						operation: ['inviteUser'],
					},
				},
				default: '',
				description: 'First name of the user to invite',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
						operation: ['inviteUser'],
					},
				},
				default: '',
				description: 'Last name of the user to invite',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
						operation: ['inviteUser'],
					},
				},
				options: [
					{ name: 'French (France)', value: 'fr_FR' },
					{ name: 'English (UK)', value: 'en_GB' },
					{ name: 'German (Germany)', value: 'de_DE' },
					{ name: 'Italian (Italy)', value: 'it_IT' },
					{ name: 'Spanish (Spain)', value: 'es_ES' },
				],
				default: 'fr_FR',
				description: 'Language/locale for the invitation',
			},
			{
				displayName: 'Role Type',
				name: 'roleType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
						operation: ['inviteUser'],
					},
				},
				options: [
					{ name: 'Owner', value: 'owner' },
					{ name: 'Admin', value: 'admin' },
					{ name: 'Normal User', value: 'normal' },
				],
				default: 'normal',
				description: 'Role type for the invited user',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['core'],
						operation: ['inviteUser'],
					},
				},
				options: [
					{
						displayName: 'Silent',
						name: 'silent',
						type: 'boolean',
						default: false,
						description: 'Whether or not the user will receive the invitation email',
					},
					{
						displayName: 'Strict',
						name: 'strict',
						type: 'boolean',
						default: true,
						description: 'Whether or not the user should register with the same email address',
					},
					{
						displayName: 'Teams',
						name: 'teams',
						type: 'string',
						default: '',
						placeholder: '1,2,3',
						description: 'Comma-separated list of team IDs the user should be added to upon invitation',
					},
					{
						displayName: 'Notifications',
						name: 'notifications',
						type: 'json',
						default: '{}',
						description: 'Notifications configuration for the user (JSON object)',
					},
					{
						displayName: 'Permissions',
						name: 'permissions',
						type: 'json',
						default: '{}',
						description: 'Permissions configuration for the user (JSON object)',
					},
				],
			},
			{
				displayName: 'Team Data',
				name: 'teamData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['teams'],
						operation: ['createTeam', 'updateTeam'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Team name',
					},
					{
						displayName: 'Owned By ID',
						name: 'ownedById',
						type: 'string',
						default: '',
						description: 'User ID of the team owner',
					},
					{
						displayName: 'Permissions',
						name: 'permissions',
						type: 'json',
						default: '{}',
						description: 'Team permissions as JSON object',
					},
				],
			},
			{
				displayName: 'Users',
				name: 'users',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['teams'],
						operation: ['addUsersToTeam', 'removeUsersFromTeam'],
					},
				},
				default: '',
				description: 'Comma-separated list of user IDs',
			},
			// kSuite Operations
			{
				displayName: 'Sub Resource',
				name: 'kSuiteSubResource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
					},
				},
				options: [
					{
						name: 'Workspace',
						value: 'workspace',
						description: 'KSuite workspace and mailbox operations',
					},
					{
						name: 'My kSuite',
						value: 'mykSuite',
						description: 'Personal kSuite management',
					},
					{
						name: 'Product Management',
						value: 'productManagement',
						description: 'KSuite product management operations',
					},
				],
				default: 'workspace',
			},
			// kSuite Workspace Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['workspace'],
					},
				},
				options: [
					{
						name: 'Get Workspace Users',
						value: 'getWorkspaceUsers',
						description: 'Get related workspace users',
						action: 'Get workspace users',
					},
					{
						name: 'Attach Mailbox',
						value: 'attachMailbox',
						description: 'Attach a mailbox to current user',
						action: 'Attach mailbox',
					},
					{
						name: 'Set Primary Mailbox',
						value: 'setPrimaryMailbox',
						description: 'Set mailbox as primary',
						action: 'Set primary mailbox',
					},
					{
						name: 'Update Mailbox Password',
						value: 'updateMailboxPassword',
						description: 'Update mailbox credential password',
						action: 'Update mailbox password',
					},
					{
						name: 'Unlink Mailbox',
						value: 'unlinkMailbox',
						description: 'Unlink a mailbox from current user',
						action: 'Unlink mailbox',
					},
				],
				default: 'getWorkspaceUsers',
			},
			// kSuite My kSuite Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['mykSuite'],
					},
				},
				options: [
					{
						name: 'Get My kSuite',
						value: 'getMykSuite',
						description: 'Show MyKSuite information',
						action: 'Get my k suite',
					},
					{
						name: 'Get Current My kSuite',
						value: 'getCurrentMykSuite',
						description: 'Load current my kSuite product',
						action: 'Get current my k suite',
					},
				],
				default: 'getMykSuite',
			},
			// kSuite Product Management Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['productManagement'],
					},
				},
				options: [
					{
						name: 'Cancel Unsubscribe',
						value: 'cancelUnsubscribe',
						description: 'Cancel unsubscription request',
						action: 'Cancel unsubscribe',
					},
				],
				default: 'cancelUnsubscribe',
			},
			// kSuite Parameters
			{
				displayName: 'Mailbox ID',
				name: 'mailboxId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['workspace'],
						operation: ['setPrimaryMailbox', 'updateMailboxPassword', 'unlinkMailbox'],
					},
				},
				default: '',
				description: 'The mailbox identifier',
			},
			{
				displayName: 'My kSuite ID',
				name: 'mykSuiteId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['mykSuite'],
						operation: ['getMykSuite'],
					},
				},
				default: '',
				description: 'The my kSuite identifier',
			},
			{
				displayName: 'My kSuite ID',
				name: 'mykSuiteId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['productManagement'],
						operation: ['cancelUnsubscribe'],
					},
				},
				default: '',
				description: 'The my kSuite identifier',
			},
			{
				displayName: 'Mailbox Data',
				name: 'mailboxData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['workspace'],
						operation: ['attachMailbox'],
					},
				},
				options: [
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Mailbox password',

					},
					{
						displayName: 'Is Primary',
						name: 'isPrimary',
						type: 'boolean',
						default: false,
						description: 'Set this mailbox as primary',
					},
				],
			},
			{
				displayName: 'New Password',
				name: 'newPassword',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['workspace'],
						operation: ['updateMailboxPassword'],
					},
				},
				default: '',
				description: 'New password for the mailbox',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['kSuite'],
						kSuiteSubResource: ['mykSuite'],
					},
				},
				options: [
					{
						displayName: 'With',
						name: 'with',
						type: 'string',
						default: '',
						description: 'Load additional data',
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
			action: ActionResource.execute,
			country: CountryResource.execute,
			event: EventResource.execute,
			language: LanguageResource.execute,
			product: ProductResource.execute,
			profile: ProfileResource.execute,
			task: TaskResource.execute,
			timezone: TimezoneResource.execute,
			userManagement: UserManagementResource.execute,
			kSuite: KSuiteResource.execute,
		};

		// Execute operations for each item
		for (let i = 0; i < items.length; i++) {
			try {
				const handler = resourceHandlers[resource];

				if (!handler) {
					throw new Error(`Unknown resource: ${resource}`);
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
