import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeConnectionType,
} from 'n8n-workflow';

export class InfomaniakCoreResources implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak CoreResources',
		name: 'infomaniakCoreResources',
		icon: 'file:InfomaniakCoreResources.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infomaniak API',
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
					{
						name: 'Invitations',
						value: 'invitations',
						description: 'Invitation management operations',
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
			// User Management Invitations Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['invitations'],
					},
				},
				options: [
					{
						name: 'Get Invitation',
						value: 'getInvitation',
						description: 'Get invitation details',
						action: 'Get invitation',
					},
					{
						name: 'Update Invitation',
						value: 'updateInvitation',

						action: 'Update invitation',
					},
					{
						name: 'Get User Invitations',
						value: 'getUserInvitations',

						action: 'Get user invitations',
					},
				],
				default: 'getInvitation',
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
				displayName: 'Invitation ID',
				name: 'invitationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['invitations'],
						operation: ['getInvitation', 'updateInvitation'],
					},
				},
				default: '',
				description: 'The invitation identifier',
			},
			{
				displayName: 'User ID for Invitations',
				name: 'userIdForInvitations',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						subResource: ['invitations'],
						operation: ['getUserInvitations'],
					},
				},
				default: '',
				description: 'The user identifier to get invitations for',
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
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Team description',
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
		const credentials = await this.getCredentials('infomaniakApi');
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'action') {
					if (operation === 'getAll') {
						// GET /1/actions
						const search = this.getNodeParameter('search', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: any = {};
						if (search) {
							qs.search = search;
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/1/actions',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							let responseData = response.data;

							if (!returnAll) {
								responseData = responseData.slice(0, limit);
							}

							returnData.push(...this.helpers.returnJsonArray(responseData));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve actions', { itemIndex: i });
						}
					} else if (operation === 'get') {
						// GET /1/actions/{action_id}
						const actionId = this.getNodeParameter('actionId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/1/actions/${actionId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else if (response.result === 'error') {
							throw new NodeOperationError(
								this.getNode(),
								`Action with ID ${actionId} not found`,
								{ itemIndex: i }
							);
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve action', { itemIndex: i });
						}
					}
				} else if (resource === 'country') {
					if (operation === 'getAll') {
						// GET /1/countries
						const search = this.getNodeParameter('search', i) as string;
						const onlyEnabled = this.getNodeParameter('onlyEnabled', i) as boolean;
						const onlyEnabledException = this.getNodeParameter('onlyEnabledException', i, '') as string;
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

						const qs: any = {};
						if (search) {
							qs.search = search;
						}
						if (onlyEnabled) {
							qs.only_enabled = onlyEnabled;
						}
						if (onlyEnabledException && onlyEnabled) {
							qs.only_enabled_exception = onlyEnabledException.split(',').map((id: string) => parseInt(id.trim()));
						}
						if (additionalOptions.orderBy) {
							qs.order_by = additionalOptions.orderBy;
						}
						if (additionalOptions.order) {
							qs.order = additionalOptions.order;
						}
						if (additionalOptions.page) {
							qs.page = additionalOptions.page;
						}
						if (additionalOptions.perPage) {
							qs.per_page = additionalOptions.perPage;
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/1/countries',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							let responseData = response.data;

							if (!returnAll) {
								responseData = responseData.slice(0, limit);
							}

							returnData.push(...this.helpers.returnJsonArray(responseData));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve countries', { itemIndex: i });
						}
					} else if (operation === 'get') {
						// GET /1/countries/{country_id}
						const countryId = this.getNodeParameter('countryId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/1/countries/${countryId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else if (response.result === 'error') {
							throw new NodeOperationError(
								this.getNode(),
								`Country with ID ${countryId} not found`,
								{ itemIndex: i }
							);
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve country', { itemIndex: i });
						}
					}
				} else if (resource === 'event') {
					if (operation === 'getAll') {
						// GET /2/events
						const eventFilters = this.getNodeParameter('eventFilters', i) as any;

						const qs: any = {};
						if (eventFilters.dateFrom) {
							qs.date_from = Math.floor(new Date(eventFilters.dateFrom).getTime() / 1000);
						}
						if (eventFilters.dateTo) {
							qs.date_to = Math.floor(new Date(eventFilters.dateTo).getTime() / 1000);
						}
						if (eventFilters.eventType) {
							qs.event_type = eventFilters.eventType;
						}
						if (eventFilters.status) {
							qs.status = eventFilters.status;
						}
						if (eventFilters.locale) {
							qs.locale = eventFilters.locale;
						}
						if (eventFilters.isCyberattack !== undefined) {
							qs.is_cyberattack = eventFilters.isCyberattack;
						}
						if (eventFilters.showAuto !== undefined) {
							qs.show_auto = eventFilters.showAuto;
						}
						if (eventFilters.withTrashed !== undefined) {
							qs.with_trashed = eventFilters.withTrashed;
						}
						if (eventFilters.userId) {
							qs.user_id = eventFilters.userId;
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/events',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve events', { itemIndex: i });
						}
					} else if (operation === 'get') {
						// GET /2/events/{event_id}
						const eventId = this.getNodeParameter('eventId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/2/events/${eventId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else if (response.result === 'error') {
							throw new NodeOperationError(
								this.getNode(),
								`Event with ID ${eventId} not found`,
								{ itemIndex: i }
							);
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve event', { itemIndex: i });
						}
					} else if (operation === 'getPublicCloudStatus') {
						// GET /2/events/public-cloud-status
						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/events/public-cloud-status',
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve public cloud status', { itemIndex: i });
						}
					}
				} else if (resource === 'language') {
					if (operation === 'getAll') {
						// GET /1/languages
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

						const qs: any = {};

						// Only add parameters if they have meaningful values
						if (additionalOptions.returnTotal) {
							qs.return = 'total';
						}
						if (additionalOptions.orderBy && additionalOptions.orderBy !== 'name') {
							qs.order_by = additionalOptions.orderBy;
						}
						if (additionalOptions.order && additionalOptions.order !== 'asc') {
							qs.order = additionalOptions.order;
						}
						if (additionalOptions.page && additionalOptions.page > 1) {
							qs.page = additionalOptions.page;
						}
						if (additionalOptions.perPage && additionalOptions.perPage > 0) {
							qs.per_page = additionalOptions.perPage;
						} else if (!additionalOptions.returnTotal && !returnAll && limit > 0) {
							qs.per_page = limit;
						}
						if (additionalOptions.skip && additionalOptions.skip > 0) {
							qs.skip = additionalOptions.skip;
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/1/languages',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							let responseData = response.data;

							if (!returnAll && !additionalOptions.returnTotal) {
								responseData = responseData.slice(0, limit);
							}

							returnData.push(...this.helpers.returnJsonArray(responseData));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve languages', { itemIndex: i });
						}
					} else if (operation === 'get') {
						// GET /1/languages/{language_id}
						const languageId = this.getNodeParameter('languageId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/1/languages/${languageId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else if (response.result === 'error') {
							throw new NodeOperationError(
								this.getNode(),
								`Language with ID ${languageId} not found`,
								{ itemIndex: i }
							);
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve language', { itemIndex: i });
						}
					}
				} else if (resource === 'product') {
					if (operation === 'getAll') {
						// GET /1/products
						const productFilters = this.getNodeParameter('productFilters', i) as any;
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

						const qs: any = {};

						// Add filters - only meaningful values
						if (productFilters.accountId && productFilters.accountId > 0) {
							qs.account_id = productFilters.accountId;
						}
						if (productFilters.customerName && productFilters.customerName.trim()) {
							qs.customer_name = productFilters.customerName;
						}
						if (productFilters.fqdn && productFilters.fqdn.trim()) {
							qs.fqdn = productFilters.fqdn;
						}
						if (productFilters.internalName && productFilters.internalName.trim()) {
							qs.internal_name = productFilters.internalName;
						}
						if (productFilters.productId && productFilters.productId > 0) {
							qs.product_id = productFilters.productId;
						}
						if (productFilters.serviceId && productFilters.serviceId > 0 && productFilters.serviceId !== 1) {
							qs.service_id = productFilters.serviceId;
						}
						if (productFilters.serviceName && productFilters.serviceName !== 'ai_tools') {
							qs.service_name = productFilters.serviceName;
						}

						// Add additional options - only meaningful values
						if (additionalOptions.with && additionalOptions.with.length > 0) {
							qs.with = additionalOptions.with;
						}
						if (additionalOptions.returnTotal) {
							qs.return = 'total';
						}
						if (additionalOptions.orderBy && additionalOptions.orderBy !== 'id') {
							qs.order_by = additionalOptions.orderBy;
						}
						if (additionalOptions.order && additionalOptions.order !== 'asc') {
							qs.order = additionalOptions.order;
						}
						if (additionalOptions.page && additionalOptions.page > 1) {
							qs.page = additionalOptions.page;
						}
						if (additionalOptions.perPage && additionalOptions.perPage > 0) {
							qs.per_page = additionalOptions.perPage;
						} else if (!additionalOptions.returnTotal && !returnAll && limit > 0) {
							qs.per_page = limit;
						}
						if (additionalOptions.skip && additionalOptions.skip > 0) {
							qs.skip = additionalOptions.skip;
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/1/products',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							let responseData = response.data;

							if (!returnAll && !additionalOptions.returnTotal) {
								responseData = responseData.slice(0, limit);
							}

							returnData.push(...this.helpers.returnJsonArray(responseData));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve products', { itemIndex: i });
						}
					}
				} else if (resource === 'profile') {
					if (operation === 'get') {
						// GET /2/profile
						const profileOptions = this.getNodeParameter('profileOptions', i) as any;

						const qs: any = {};
						if (profileOptions.with) {
							qs.with = profileOptions.with;
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve profile', { itemIndex: i });
						}
					} else if (operation === 'update') {
						// PATCH /2/profile
						const profileData = this.getNodeParameter('profileData', i) as any;

						const body: any = {};
						if (profileData.email) body.email = profileData.email;
						if (profileData.firstname) body.firstname = profileData.firstname;
						if (profileData.lastname) body.lastname = profileData.lastname;
						if (profileData.countryId) body.country_id = profileData.countryId;
						if (profileData.languageId) body.language_id = profileData.languageId;
						if (profileData.locale) body.locale = profileData.locale;
						if (profileData.timezone) body.timezone = profileData.timezone;
						if (profileData.password) body.password = profileData.password;
						if (profileData.currentPassword) body.current_password = profileData.currentPassword;

						const options: IHttpRequestOptions = {
							method: 'PATCH' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile',
							body,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to update profile', { itemIndex: i });
						}
					} else if (operation === 'uploadAvatar') {
						// POST /2/profile/avatar
						const avatarData = this.getNodeParameter('avatarData', i) as any;

						const body: any = {
							avatar: avatarData.avatar,
							encoding: avatarData.encoding || 'base64',
						};

						const options: IHttpRequestOptions = {
							method: 'POST' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile/avatar',
							body,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to upload avatar', { itemIndex: i });
						}
					} else if (operation === 'deleteAvatar') {
						// DELETE /2/profile/avatar
						const options: IHttpRequestOptions = {
							method: 'DELETE' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile/avatar',
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success') {
							returnData.push({ json: { success: true, message: 'Avatar deleted successfully' } });
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to delete avatar', { itemIndex: i });
						}
					} else if (operation === 'getAppPasswords') {
						// GET /2/profile/applications/passwords
						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile/applications/passwords',
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve application passwords', { itemIndex: i });
						}
					} else if (operation === 'createAppPassword') {
						// POST /2/profile/applications/passwords
						const options: IHttpRequestOptions = {
							method: 'POST' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile/applications/passwords',
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to create application password', { itemIndex: i });
						}
					} else if (operation === 'getAppPassword') {
						// GET /2/profile/applications/passwords/{password_id}
						const passwordId = this.getNodeParameter('passwordId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/2/profile/applications/passwords/${passwordId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), `Failed to retrieve application password ${passwordId}`, { itemIndex: i });
						}
					} else if (operation === 'getEmails') {
						// GET /2/profile/emails
						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile/emails',
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve profile emails', { itemIndex: i });
						}
					} else if (operation === 'getEmail') {
						// GET /2/profile/emails/{email_type}/{email_id}
						const emailType = this.getNodeParameter('emailType', i) as string;
						const emailId = this.getNodeParameter('emailId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/2/profile/emails/${emailType}/${emailId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), `Failed to retrieve email ${emailType}/${emailId}`, { itemIndex: i });
						}
					} else if (operation === 'deleteEmail') {
						// DELETE /2/profile/emails/{email_type}/{email_id}
						const emailType = this.getNodeParameter('emailType', i) as string;
						const emailId = this.getNodeParameter('emailId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'DELETE' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/2/profile/emails/${emailType}/${emailId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success') {
							returnData.push({ json: { success: true, message: `Email ${emailType}/${emailId} deleted successfully` } });
						} else {
							throw new NodeOperationError(this.getNode(), `Failed to delete email ${emailType}/${emailId}`, { itemIndex: i });
						}
					} else if (operation === 'getPhones') {
						// GET /2/profile/phones
						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/2/profile/phones',
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve profile phones', { itemIndex: i });
						}
					} else if (operation === 'getPhone') {
						// GET /2/profile/phones/{phone_id}
						const phoneId = this.getNodeParameter('phoneId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/2/profile/phones/${phoneId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else {
							throw new NodeOperationError(this.getNode(), `Failed to retrieve phone ${phoneId}`, { itemIndex: i });
						}
					} else if (operation === 'deletePhone') {
						// DELETE /2/profile/phones/{phone_id}
						const phoneId = this.getNodeParameter('phoneId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'DELETE' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/2/profile/phones/${phoneId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success') {
							returnData.push({ json: { success: true, message: `Phone ${phoneId} deleted successfully` } });
						} else {
							throw new NodeOperationError(this.getNode(), `Failed to delete phone ${phoneId}`, { itemIndex: i });
						}
					}
				} else if (resource === 'task') {
					if (operation === 'getAll') {
						// GET /1/async/tasks
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

						const qs: any = {};

						// Only add meaningful parameters
						if (additionalOptions.return && additionalOptions.return !== 'total') {
							qs.return = additionalOptions.return;
						}
						if (additionalOptions.skip && additionalOptions.skip > 0) {
							qs.skip = additionalOptions.skip;
						}
						if (additionalOptions.page && additionalOptions.page > 1) {
							qs.page = additionalOptions.page;
						}
						if (additionalOptions.perPage && additionalOptions.perPage > 0) {
							qs.per_page = additionalOptions.perPage;
						} else if (!additionalOptions.return && !returnAll && limit > 0) {
							qs.per_page = limit;
						}
						if (additionalOptions.orderBy && additionalOptions.orderBy !== 'id') {
							qs.order_by = additionalOptions.orderBy;
						}
						if (additionalOptions.order && additionalOptions.order !== 'asc') {
							qs.order = additionalOptions.order;
						}
						if (additionalOptions.orderFor && Object.keys(additionalOptions.orderFor).length > 0) {
							qs.order_for = additionalOptions.orderFor;
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/1/async/tasks',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							let responseData = response.data;

							if (!returnAll && !additionalOptions.return) {
								responseData = responseData.slice(0, limit);
							}

							returnData.push(...this.helpers.returnJsonArray(responseData));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve tasks', { itemIndex: i });
						}
					} else if (operation === 'get') {
						// GET /1/async/tasks/{task_uuid}
						const taskUuid = this.getNodeParameter('taskUuid', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/1/async/tasks/${taskUuid}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else if (response.result === 'error') {
							throw new NodeOperationError(
								this.getNode(),
								`Task with UUID ${taskUuid} not found`,
								{ itemIndex: i }
							);
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve task', { itemIndex: i });
						}
					}
				} else if (resource === 'timezone') {
					if (operation === 'getAll') {
						// GET /1/timezones
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

						const qs: any = {};

						// Only add meaningful parameters
						if (additionalOptions.search && additionalOptions.search.trim()) {
							qs.search = additionalOptions.search;
						}
						if (additionalOptions.return && additionalOptions.return !== 'total') {
							qs.return = additionalOptions.return;
						}
						if (additionalOptions.skip && additionalOptions.skip > 0) {
							qs.skip = additionalOptions.skip;
						}
						if (additionalOptions.page && additionalOptions.page > 1) {
							qs.page = additionalOptions.page;
						}
						if (additionalOptions.perPage && additionalOptions.perPage > 0) {
							qs.per_page = additionalOptions.perPage;
						} else if (!additionalOptions.return && !returnAll && limit > 0) {
							qs.per_page = limit;
						}
						if (additionalOptions.orderBy && additionalOptions.orderBy !== 'id') {
							qs.order_by = additionalOptions.orderBy;
						}
						if (additionalOptions.order && additionalOptions.order !== 'asc') {
							qs.order = additionalOptions.order;
						}
						if (additionalOptions.orderFor) {
							try {
								const orderForObj = typeof additionalOptions.orderFor === 'string'
									? JSON.parse(additionalOptions.orderFor)
									: additionalOptions.orderFor;
								if (Object.keys(orderForObj).length > 0) {
									qs.order_for = orderForObj;
								}
							} catch (error) {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON format for Order For parameter', { itemIndex: i });
							}
						}

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								Authorization: `Bearer ${credentials.apiToken}`,
								'Content-Type': 'application/json',
							},
							url: 'https://api.infomaniak.com/1/timezones',
							qs,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							let responseData = response.data;

							if (!returnAll && !additionalOptions.return) {
								responseData = responseData.slice(0, limit);
							}

							returnData.push(...this.helpers.returnJsonArray(responseData));
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve timezones', { itemIndex: i });
						}
					} else if (operation === 'get') {
						// GET /1/timezones/{timezone_id}
						const timezoneId = this.getNodeParameter('timezoneId', i) as number;

						const options: IHttpRequestOptions = {
							method: 'GET' as IHttpRequestMethods,
							headers: {
								'Content-Type': 'application/json',
							},
							url: `https://api.infomaniak.com/1/timezones/${timezoneId}`,
							json: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.result === 'success' && response.data) {
							returnData.push(...this.helpers.returnJsonArray(response.data));
						} else if (response.result === 'error') {
							throw new NodeOperationError(
								this.getNode(),
								`Timezone with ID ${timezoneId} not found`,
								{ itemIndex: i }
							);
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve timezone', { itemIndex: i });
						}
					}
				} else if (resource === 'userManagement') {
					const subResource = this.getNodeParameter('subResource', i) as string;

					if (subResource === 'core') {
						if (operation === 'inviteUser') {
							// POST /1/accounts/{account}/invitations
							const accountId = this.getNodeParameter('accountId', i) as string;
							const email = this.getNodeParameter('email', i) as string;

							const body = {
								email: email,
							};

							const options: IHttpRequestOptions = {
								method: 'POST' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/accounts/${accountId}/invitations`,
								body,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to invite user', { itemIndex: i });
							}
						} else if (operation === 'cancelInvitation') {
							// DELETE /1/accounts/{account}/invitations/{invitation}
							const accountId = this.getNodeParameter('accountId', i) as string;
							const invitationId = this.getNodeParameter('invitationId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'DELETE' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/accounts/${accountId}/invitations/${invitationId}`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success') {
								returnData.push({ json: { success: true, message: `Invitation ${invitationId} cancelled successfully` } });
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to cancel invitation', { itemIndex: i });
							}
						}
					} else if (subResource === 'accounts') {
						if (operation === 'listAccounts') {
							// GET /1/accounts
							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: 'https://api.infomaniak.com/1/accounts',
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve accounts', { itemIndex: i });
							}
						} else if (operation === 'getAccount') {
							// GET /1/accounts/{account_id}
							const accountId = this.getNodeParameter('accountId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/accounts/${accountId}`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve account', { itemIndex: i });
							}
						} else if (operation === 'listUsers') {
							// GET /2/accounts/{account}/users
							const accountId = this.getNodeParameter('accountId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/2/accounts/${accountId}/users`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve users', { itemIndex: i });
							}
						}
					} else if (subResource === 'teams') {
						if (operation === 'listTeams') {
							// GET /1/accounts/{account}/teams
							const accountId = this.getNodeParameter('accountId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/accounts/${accountId}/teams`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve teams', { itemIndex: i });
							}
						} else if (operation === 'createTeam') {
							// POST /1/accounts/{account}/teams
							const accountId = this.getNodeParameter('accountId', i) as string;
							const teamData = this.getNodeParameter('teamData', i) as any;

							const body = {
								name: teamData.name,
								description: teamData.description,
							};

							const options: IHttpRequestOptions = {
								method: 'POST' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/accounts/${accountId}/teams`,
								body,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to create team', { itemIndex: i });
							}
						} else if (operation === 'deleteTeam') {
							// DELETE /1/accounts/{account}/teams/{team}
							const accountId = this.getNodeParameter('accountId', i) as string;
							const teamId = this.getNodeParameter('teamId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'DELETE' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/accounts/${accountId}/teams/${teamId}`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success') {
								returnData.push({ json: { success: true, message: `Team ${teamId} deleted successfully` } });
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to delete team', { itemIndex: i });
							}
						}
					} else if (subResource === 'invitations') {
						if (operation === 'getInvitation') {
							// GET /1/accounts/{account}/invitations/{invitation}
							const accountId = this.getNodeParameter('accountId', i) as string;
							const invitationId = this.getNodeParameter('invitationId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/accounts/${accountId}/invitations/${invitationId}`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve invitation', { itemIndex: i });
							}
						}
					}
				} else if (resource === 'kSuite') {
					const kSuiteSubResource = this.getNodeParameter('kSuiteSubResource', i) as string;

					if (kSuiteSubResource === 'workspace') {
						if (operation === 'getWorkspaceUsers') {
							// GET /2/profile/ksuites/mailboxes
							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: 'https://api.infomaniak.com/2/profile/ksuites/mailboxes',
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve workspace users', { itemIndex: i });
							}
						} else if (operation === 'attachMailbox') {
							// POST /2/profile/ksuites/mailboxes
							const mailboxData = this.getNodeParameter('mailboxData', i) as any;

							const body: any = {
								password: mailboxData.password,
							};

							if (mailboxData.isPrimary !== undefined) {
								body.is_primary = mailboxData.isPrimary;
							}

							const options: IHttpRequestOptions = {
								method: 'POST' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: 'https://api.infomaniak.com/2/profile/ksuites/mailboxes',
								body,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to attach mailbox', { itemIndex: i });
							}
						} else if (operation === 'setPrimaryMailbox') {
							// PUT /2/profile/ksuites/mailboxes/{mailbox_id}/set_primary
							const mailboxId = this.getNodeParameter('mailboxId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'PUT' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/2/profile/ksuites/mailboxes/${mailboxId}/set_primary`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success') {
								returnData.push({ json: { success: true, message: `Mailbox ${mailboxId} set as primary successfully` } });
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to set primary mailbox', { itemIndex: i });
							}
						} else if (operation === 'updateMailboxPassword') {
							// PUT /2/profile/ksuites/mailboxes/{mailbox_id}/update_password
							const mailboxId = this.getNodeParameter('mailboxId', i) as string;
							const newPassword = this.getNodeParameter('newPassword', i) as string;

							const body = {
								password: newPassword,
							};

							const options: IHttpRequestOptions = {
								method: 'PUT' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/2/profile/ksuites/mailboxes/${mailboxId}/update_password`,
								body,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success') {
								returnData.push({ json: { success: true, message: `Mailbox ${mailboxId} password updated successfully` } });
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to update mailbox password', { itemIndex: i });
							}
						} else if (operation === 'unlinkMailbox') {
							// DELETE /2/profile/ksuites/mailboxes/{mailbox_id}
							const mailboxId = this.getNodeParameter('mailboxId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'DELETE' as IHttpRequestMethods,
								headers: {
									Authorization: `Bearer ${credentials.apiToken}`,
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/2/profile/ksuites/mailboxes/${mailboxId}`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success') {
								returnData.push({ json: { success: true, message: `Mailbox ${mailboxId} unlinked successfully` } });
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to unlink mailbox', { itemIndex: i });
							}
						}
					} else if (kSuiteSubResource === 'mykSuite') {
						if (operation === 'getMykSuite') {
							// GET /1/my_ksuite/{my_k_suite_id}
							const mykSuiteId = this.getNodeParameter('mykSuiteId', i) as string;
							const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

							const qs: any = {};
							if (additionalOptions.with) {
								qs.with = additionalOptions.with;
							}

							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/my_ksuite/${mykSuiteId}`,
								qs,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve my kSuite', { itemIndex: i });
							}
						} else if (operation === 'getCurrentMykSuite') {
							// GET /1/my_ksuite/current
							const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

							const qs: any = {};
							if (additionalOptions.with) {
								qs.with = additionalOptions.with;
							}

							const options: IHttpRequestOptions = {
								method: 'GET' as IHttpRequestMethods,
								headers: {
									'Content-Type': 'application/json',
								},
								url: 'https://api.infomaniak.com/1/my_ksuite/current',
								qs,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success' && response.data) {
								returnData.push(...this.helpers.returnJsonArray(response.data));
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to retrieve current my kSuite', { itemIndex: i });
							}
						}
					} else if (kSuiteSubResource === 'productManagement') {
						if (operation === 'cancelUnsubscribe') {
							// POST /1/my_ksuite/{my_k_suite_id}/cancel_unsubscribe
							const mykSuiteId = this.getNodeParameter('mykSuiteId', i) as string;

							const options: IHttpRequestOptions = {
								method: 'POST' as IHttpRequestMethods,
								headers: {
									'Content-Type': 'application/json',
								},
								url: `https://api.infomaniak.com/1/my_ksuite/${mykSuiteId}/cancel_unsubscribe`,
								json: true,
							};

							const response = await this.helpers.httpRequest(options);

							if (response.result === 'success') {
								returnData.push({ json: { success: true, message: `Unsubscription cancelled for kSuite ${mykSuiteId}` } });
							} else {
								throw new NodeOperationError(this.getNode(), 'Failed to cancel unsubscription', { itemIndex: i });
							}
						}
					}
				}
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