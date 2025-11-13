/**
 * API Types for Streaming Radio
 */

// ============================================================================
// RadioProduct Types
// ============================================================================

export interface RadioProduct {
	id: number;
	customer_name: string;
	product_name: string;
	[key: string]: unknown;
}

// ============================================================================
// Station Types
// ============================================================================

export interface Station {
	id: number;
	name: string;
	is_daily_restart?: boolean;
	is_send_logs?: boolean;
	time_daily_restart?: string;
	timezone_daily_restart?: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Stream Types
// ============================================================================

export interface Stream {
	id: number;
	name: string;
	format: string;
	bitrate: number;
	url?: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Player Types
// ============================================================================

export interface Player {
	id: number;
	name: string;
	uuid?: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}
