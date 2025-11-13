/**
 * API Types for Swiss Backup
 */

// ============================================================================
// SwissBackup Types
// ============================================================================

export interface SwissBackup {
	id: number;
	customer_name: string;
	periodicity?: 'monthly' | 'yearly';
	storage_reserved_acronis?: number;
	storage_total?: number;
	storage_used?: number;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}

// ============================================================================
// Slot Types
// ============================================================================

export interface Slot {
	id: number;
	customer_name: string;
	email: string;
	size: number;
	type: 'acronis' | 'dedicated';
	connection_type?: 'ftp' | 'sftp';
	firstname?: string;
	lastname?: string;
	lang?: string;
	status?: string;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}
