/**
 * API Types for Newsletter
 */

// ============================================================================
// Campaign Types
// ============================================================================

export interface Campaign {
	id: number;
	domain_id: number;
	subject: string;
	email_from_addr: string;
	email_from_name: string;
	lang: 'de_DE' | 'en_GB' | 'es_ES' | 'fr_FR' | 'it_IT';
	content_html?: string;
	preheader?: string;
	status: string;
	created_at?: string;
	updated_at?: string;
	sent_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Subscriber Types
// ============================================================================

export interface Subscriber {
	id: number;
	email: string;
	status: string;
	created_at?: string;
	updated_at?: string;
	groups?: Group[];
	fields?: Record<string, unknown>;
	[key: string]: unknown;
}

// ============================================================================
// Group Types
// ============================================================================

export interface Group {
	id: number;
	name: string;
	created_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Domain Types
// ============================================================================

export interface Domain {
	id: number;
	name: string;
	[key: string]: unknown;
}
