/**
 * API Types for URL Shortener
 */

/**
 * Short URL return type
 */
export interface ShortUrl {
	code: string;
	url: string;
	created_at: number;
	expiration_date: number;
}

/**
 * Quota return type
 */
export interface ShortUrlQuota {
	quota: number;
	limit: number;
}
