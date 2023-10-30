/// --- Types ----------------------------------------------------------------------------------------------------------
export type Headers = { [key: string]: string };

export type Method = "HEAD" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE";

export type PathParams = { [key: string]: string | null };

export type QueryParams = { [key: string]: string };

export type SerializedBody = ReadableStream<string> | string;

export type JSONResponse<B = unknown, R = object> = R & {
	status: number
	message?: string
	data: B
	error?: string
};