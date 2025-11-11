# n8n-nodes-infomaniak

[![Version](https://img.shields.io/npm/v/n8n-nodes-infomaniak)](https://www.npmjs.com/package/n8n-nodes-infomaniak)
[![License](https://img.shields.io/npm/l/n8n-nodes-infomaniak)](https://github.com/ascenziach/n8n-nodes-infomaniak/blob/master/LICENSE)

> **⚠️ BETA VERSION**: This package is currently in beta. While fully functional, the API may change based on user feedback. Please report any issues on [GitHub](https://github.com/ascenziach/n8n-nodes-infomaniak/issues).

This is an n8n community node that lets you interact with the [Infomaniak API](https://developer.infomaniak.com/) directly from your n8n workflows.

Infomaniak is a Swiss hosting provider offering cloud hosting, domain names, emails, and various digital services. This node allows you to automate tasks across their platform.

**Developed by [Ascenzia](https://ascenzia.ch)** - Swiss digital solutions provider.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage Examples](#usage-examples)
- [Resources](#resources)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Community Nodes (Recommended)

Install directly from n8n:

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-infomaniak` in the search
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-infomaniak
```

For manual installation in n8n Docker setups, add to your package.json or install in the n8n custom nodes directory.

## Prerequisites

- n8n instance (self-hosted or cloud)
- Infomaniak account
- Infomaniak API token ([How to get one](https://developer.infomaniak.com/docs/api/get-started/create-an-api-token))

## Operations

This node provides access to the following Infomaniak resources:

### Core Resources

| Resource | Operations | Description |
|----------|-----------|-------------|
| **Action** | Get All, Get | Retrieve actions from your Infomaniak account |
| **Country** | Get All, Get | Access country information and settings |
| **Event** | Get All, Get, Get Public Cloud Status | Monitor events and public cloud status |
| **Language** | Get All, Get | Access available languages |
| **Product** | Get All | List products in your account |
| **Task** | Get All, Get | Monitor asynchronous tasks |
| **Timezone** | Get All, Get | Access timezone information |

### Profile Management

| Operation | Description |
|-----------|-------------|
| Get Profile | Retrieve user profile information |
| Update Profile | Update profile details (name, locale, timezone, etc.) |
| Upload Avatar | Upload a profile avatar image |
| Delete Avatar | Remove profile avatar |
| Get App Passwords | List application-specific passwords |
| Create App Password | Generate new application password |
| Get App Password | Retrieve specific app password details |
| Get Emails | List all email addresses |
| Get Email | Get specific email details |
| Delete Email | Remove an email address |
| Get Phones | List all phone numbers |
| Get Phone | Get specific phone details |
| Delete Phone | Remove a phone number |

### User Management

Manage users, accounts, teams, and invitations:

#### Core Operations
- **Invite User**: Send invitation to join an account
- **Cancel Invitation**: Cancel a pending invitation

#### Account Operations
- **List Accounts**: Retrieve all accounts
- **Get Account**: Get specific account details
- **List Users**: List users in an account

#### Team Operations
- **List Teams**: Retrieve all teams in an account
- **Create Team**: Create a new team
- **Get Team**: Get team details
- **Update Team**: Update team information
- **Delete Team**: Remove a team

### kSuite Management

Manage kSuite workspaces, mailboxes, and products:

#### Workspace Operations
- **Get Workspace Users**: List mailboxes in workspace
- **Attach Mailbox**: Add a mailbox to workspace
- **Set Primary Mailbox**: Set default mailbox
- **Update Mailbox Password**: Change mailbox password
- **Unlink Mailbox**: Remove mailbox from workspace

#### mykSuite Operations
- **Get mykSuite**: Retrieve specific kSuite details
- **Get Current mykSuite**: Get current kSuite information

#### Product Management
- **Cancel Unsubscribe**: Cancel a pending cancellation

## Credentials

To use this node, you'll need to configure Infomaniak API credentials:

1. In n8n, go to **Credentials** > **New**
2. Search for **Infomaniak API**
3. Enter your API Token

### Getting an API Token

1. Log in to your [Infomaniak Manager](https://manager.infomaniak.com/)
2. Go to **API Management** section
3. Click **Create API Token**
4. Give it a descriptive name
5. Select the required scopes for your use case
6. Copy the generated token immediately (you won't be able to see it again)

## Compatibility

- **n8n version**: 0.220.0 or later
- **Node.js**: 20.15 or later
- **API Version**: Supports both Infomaniak API v1 and v2 endpoints

## Usage Examples

### Example 1: Get Profile Information

```
1. Add "Infomaniak CoreResources" node
2. Select Resource: Profile
3. Select Operation: Get Profile
4. (Optional) Add additional options like "with" parameter
5. Execute the workflow
```

### Example 2: Invite User to Account

```
1. Add "Infomaniak CoreResources" node
2. Select Resource: User Management
3. Select Sub-Resource: Core
4. Select Operation: Invite User
5. Fill in required fields:
   - Account ID
   - Email
   - First Name
   - Last Name
   - Locale (e.g., en_GB, fr_FR)
   - Role Type (0-5)
6. Execute the workflow
```

### Example 3: List All Products

```
1. Add "Infomaniak CoreResources" node
2. Select Resource: Product
3. Select Operation: Get All
4. Configure pagination options
5. Execute the workflow
```

## Resources

- [Infomaniak API Documentation](https://developer.infomaniak.com/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/ascenziach/n8n-nodes-infomaniak)
- [Report Issues](https://github.com/ascenziach/n8n-nodes-infomaniak/issues)

## Development

### Project Structure

The project follows a modular architecture for maintainability:

```
nodes/InfomaniakCoreResources/
├── types/              # TypeScript type definitions
│   ├── api.types.ts    # API response types
│   ├── node.types.ts   # n8n node types
│   └── index.ts        # Type exports
├── utils/              # Utility functions
│   ├── apiRequest.ts   # HTTP request handling
│   ├── constants.ts    # Constants and configuration
│   ├── transformers.ts # Data transformation utilities
│   ├── validation.ts   # Input validation functions
│   └── index.ts        # Utility exports
├── resources/          # Resource handlers
│   ├── Action.resource.ts
│   ├── Country.resource.ts
│   ├── Event.resource.ts
│   ├── Language.resource.ts
│   ├── Product.resource.ts
│   ├── Profile.resource.ts
│   ├── Task.resource.ts
│   ├── Timezone.resource.ts
│   ├── UserManagement.resource.ts
│   ├── kSuite.resource.ts
│   └── index.ts
└── InfomaniakCoreResources.node.ts  # Main node orchestrator
```

### Build from Source

```bash
# Clone the repository
git clone https://github.com/ascenziach/n8n-nodes-infomaniak.git
cd n8n-nodes-infomaniak

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

### Available Scripts

- `npm run build` - Build the project
- `npm run dev` - Watch mode for development
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Check code style
- `npm run lintfix` - Auto-fix code style issues
- `npm run format` - Format code with Prettier

### Architecture Highlights

#### Type Safety
- Comprehensive TypeScript type definitions
- No `any` types in production code
- Full IntelliSense support

#### Modular Design
- Each resource in separate file
- Shared utilities for common operations
- Easy to extend and maintain

#### Robust Validation
- RFC 5322 compliant email validation
- ID validation with type coercion
- Locale and role type validation
- Safe JSON parsing

#### Error Handling
- Consistent error messages
- Proper error context
- Support for `continueOnFail` option

#### API Version Support
- Automatic detection of API v1 vs v2
- Unified request interface
- Transparent version handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Lint your code (`npm run lint`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Add JSDoc comments for public functions
- Write tests for new features
- Keep functions small and focused

## Version History

### 1.4.0 (Current - BETA)
- 🎉 Complete architecture refactoring
- ✨ Modular resource-based structure
- ✅ Comprehensive TypeScript type definitions
- 🛡️ Enhanced validation and error handling
- 🧪 Added unit tests
- 📝 Improved documentation
- 🚀 Better performance and maintainability

### Previous Versions
- 1.3.0 - Added User Management operations
- 1.2.0 - Added Profile management
- 1.1.0 - Added kSuite support
- 1.0.0 - Initial release

## Troubleshooting

### Common Issues

**Issue**: Authentication failed
**Solution**: Verify your API token is correct and has the necessary scopes

**Issue**: 422 Error when inviting user
**Solution**: Check that all required fields are provided and in correct format (especially locale and role_type)

**Issue**: Module not found errors
**Solution**: Run `npm install` and ensure n8n-workflow peer dependency is available

**Issue**: TypeScript compilation errors
**Solution**: Ensure you're using TypeScript 5.8+ and Node.js 20.15+

## Support

- 📧 Email: ascenziach@users.noreply.github.com
- 🐛 Issues: [GitHub Issues](https://github.com/ascenziach/n8n-nodes-infomaniak/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/ascenziach/n8n-nodes-infomaniak/discussions)

## Security

If you discover a security vulnerability, please email ascenziach@users.noreply.github.com instead of using the issue tracker.

## License

[MIT](LICENSE) © ascenziach

---

**Developed by [Ascenzia](https://ascenzia.ch)** - Swiss digital solutions provider.

**Made with ❤️ for the n8n and Infomaniak communities**

**⚠️ Beta Notice**: This is a beta release. Features and APIs may change. We appreciate your feedback to make this node better!
