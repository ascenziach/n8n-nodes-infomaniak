/**
 * API Types for Infomaniak DNS
 *
 * Type definitions for DNS zones, records, and related entities
 */

/**
 * DNS Zone
 */
export interface DNSZone {
	id: number;
	customer_name: string;
	contact_emails: string[];
	dnssec_status: boolean;
	records_count: number;
	serial: number;
	source: string;
	version: number;
	created_at: string;
	updated_at: string;
}

/**
 * DNS Record
 */
export interface DNSRecord {
	id: number;
	source: string;
	type: DNSRecordType;
	target: string;
	target_idn?: string;
	ttl?: number;
	priority?: number;
	comment?: string;
	created_at?: string;
	updated_at?: string;
}

/**
 * DNS Record Types
 */
export type DNSRecordType =
	| 'A'
	| 'AAAA'
	| 'ALIAS'
	| 'CAA'
	| 'CNAME'
	| 'DKIM'
	| 'LOC'
	| 'MX'
	| 'NS'
	| 'PTR'
	| 'SPF'
	| 'SRV'
	| 'SSHFP'
	| 'TLSA'
	| 'TXT'
	| 'URL';

/**
 * DNSSEC Status
 */
export interface DNSSECStatus {
	status: 'enabled' | 'disabled' | 'pending';
	ds_records?: DSRecord[];
}

/**
 * DS Record for DNSSEC
 */
export interface DSRecord {
	key_tag: number;
	algorithm: number;
	digest_type: number;
	digest: string;
}

/**
 * Nameserver Configuration
 */
export interface NameserverConfig {
	nameservers: string[];
}

/**
 * Zone Import/Export
 */
export interface ZoneData {
	zone: string;
	records: DNSRecord[];
}
