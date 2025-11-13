/**
 * API Types for VOD (Video On Demand)
 */

// ============================================================================
// Channel Types
// ============================================================================

export interface Channel {
	id: string;
	name: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Media Types
// ============================================================================

export interface Media {
	id: string;
	title: string;
	description?: string;
	published?: boolean;
	duration?: number;
	url?: string;
	thumbnail?: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Folder Types
// ============================================================================

export interface Folder {
	id: string;
	name: string;
	parent_id?: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Player Types
// ============================================================================

export interface Player {
	id: string;
	name: string;
	config?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}
