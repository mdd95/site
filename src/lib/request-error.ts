import { message } from 'valibot';

export type RequestErrorCode =
	| 'BAD_REQUEST'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'METHOD_NOT_ALLOWED'
	| 'CONFLICT'
	| 'TOO_MANY_REQUESTS'
	| 'INTERNAL_SERVER_ERROR'
	| 'NOT_IMPLEMENTED'
	| 'BAD_GATEWAY'
	| 'SERVICE_UNAVAILABLE'
	| 'GATEWAY_TIMEOUT';

export type RequestError = {
	status: number;
	code: RequestErrorCode;
	message?: string;
};

function createRequestError(
	status: number,
	code: RequestErrorCode,
	message?: string
): RequestError {
	return { status, code, message };
}

export const RequestError = {
	badRequest: (message?: string) => createRequestError(400, 'BAD_REQUEST', message),
	unauthorized: (message?: string) => createRequestError(401, 'UNAUTHORIZED', message),
	forbidden: (message?: string) => createRequestError(403, 'FORBIDDEN', message),
	notFound: (message?: string) => createRequestError(404, 'NOT_FOUND', message),
	internalServerError: (message?: string) =>
		createRequestError(500, 'INTERNAL_SERVER_ERROR', message),
	notImplemented: (message?: string) => createRequestError(501, 'NOT_IMPLEMENTED', message)
};
