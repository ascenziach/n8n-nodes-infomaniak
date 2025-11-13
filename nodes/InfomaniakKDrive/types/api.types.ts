/**
 * API Types for kDrive
 */

// ============================================================================
// Drive Types
// ============================================================================

export interface Drive {
	id: number;
	name: string;
	size: number;
	used_size?: number;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// File Types
// ============================================================================

export interface File {
	id: number;
	name: string;
	type: 'file' | 'directory';
	size?: number;
	path?: string;
	parent_id?: number;
	created_at?: string;
	updated_at?: string;
	is_favorite?: boolean;
	[key: string]: unknown;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
	id: number;
	email: string;
	role: 'admin' | 'user' | 'external';
	display_name?: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}
