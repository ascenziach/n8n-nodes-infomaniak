/**
 * API Request Utilities for eTicket
 *
 * Reuses the core API request functions from InfomaniakCoreResources
 */

export {
	infomaniakApiRequest,
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestPATCH,
	infomaniakApiRequestDELETE,
} from '../../InfomaniakCoreResources/utils/apiRequest';

export {
	buildQueryString,
	buildRequestBody,
	applyPagination,
} from '../../InfomaniakCoreResources/utils/transformers';
