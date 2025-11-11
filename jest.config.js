module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/test'],
	testMatch: ['**/*.test.ts'],
	collectCoverageFrom: [
		'nodes/**/*.ts',
		'!nodes/**/*.node.ts',
		'!nodes/**/types/**',
		'!**/node_modules/**',
	],
	moduleNameMapper: {
		'^n8n-workflow$': '<rootDir>/node_modules/n8n-workflow',
	},
};
