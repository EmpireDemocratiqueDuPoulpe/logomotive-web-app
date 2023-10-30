import urlJoin from "url-join";
import { API } from "@/constants";
import type { Method, Headers, SerializedBody, JSONResponse, PathParams, QueryParams } from "./Endpoint.types";

/************************************************************
 * API Endpoint
 ***********************************************************/
class Endpoint<I extends object | undefined, O> {
	private method: Method = "HEAD";
	private path: string = "";
	private preparedPath: string | null = null;
	private globalHeaders: Headers = { "Accept": "application/json" };
	private additionalHeaders: Headers = {};
	private body: SerializedBody | I | null = null;
	private credentials: RequestCredentials = "include";
	private parseResponse: boolean = true;

	constructor(method: Method, path: string) {
		this.setMethod(method);
		this.setPath(path);
	}

	/* ---- Getters ----------------------------------- */
	public getPath(): string {
		return this.path;
	}

	protected getRequestPath(): string {
		return this.preparedPath ?? this.getPath();
	}

	public getHeaders(): Headers {
		return this.additionalHeaders;
	}

	public getAllHeaders(): Headers {
		return Object.fromEntries(
			Object.entries({ ...this.globalHeaders, ...this.additionalHeaders })
				.filter(([ , v ]) => v != null)
		);
	}

	public getCredentials() : RequestCredentials {
		return this.credentials;
	}

	public isResponseParsed() : boolean {
		return this.parseResponse;
	}

	/* ---- Setters ----------------------------------- */
	public setMethod(method: Method): this {
		this.method = method;
		return this;
	}

	public setPath(path: string): this {
		this.path = path;
		return this;
	}

	protected setRequestPath(requestPath: string | null): this {
		this.preparedPath = requestPath;
		return this;
	}

	public addHeaders(headers: Headers): this {
		if (headers) {
			this.additionalHeaders = { ...this.additionalHeaders, ...headers };
		}

		return this;
	}

	protected setBody(body: SerializedBody | I | null): this {
		this.body = body;
		return this;
	}

	public setCredentials(credentials: RequestCredentials) : this {
		this.credentials = credentials;
		return this;
	}

	public setParseResponse(parse: boolean = true) : this {
		this.parseResponse = parse;
		return this;
	}

	/* ---- Functions --------------------------------- */
	public async fetch(..._args: unknown[]): Promise<JSONResponse<O>> {
		const uri: string = urlJoin(API.BASE_URL, this.getRequestPath());
		const options: RequestInit = {
			method: this.method,
			headers: this.getAllHeaders(),
			mode: "cors",
			credentials: this.credentials
		};

		if (this.body) {
			// @ts-ignore
			options.body = this.body;
		}

		return new Promise((resolve, reject): void => {
			fetch(uri, options)
				.then((response: Response) => response.text().then((text: string) => ({
					status: response.ok,
					data: text
				})))
				.then(response => ({
					...response,
					data: { ...((this.parseResponse && response.data) ? JSON.parse(response.data) : response.data) },
				}))
				.then(response => response.status ? resolve(response.data) : reject(response.data))
				.catch(reject);
		});
	}
}

/************************************************************
 * Payloads
 ***********************************************************/
class BodyPayload<I extends object | undefined, O> extends Endpoint<I, O> {
	private stringify: boolean = true;

	/* ---- Setters ----------------------------------- */
	public setStringify(enabled: boolean = true): BodyPayload<I, O> {
		this.stringify = enabled;
		return this;
	}

	/* ---- Getters ----------------------------------- */
	public willStringify(): boolean {
		return this.stringify;
	}

	/* ---- Functions --------------------------------- */
	private processBody(args?: I): void {
		let body: SerializedBody | I | null = null;

		if (args) {
			body = this.willStringify() ? JSON.stringify(args) : args;
		}

		if (body) {
			this.setBody(body);
		}
	}

	public async fetch(args?: I) {
		this.processBody(args);
		return super.fetch();
	}
}

class URIPayload<O> extends Endpoint<undefined, O> {
	/* ---- Getters ----------------------------------- */
	private buildFullPath(pathParams: PathParams | null = null, queryParams: QueryParams | null = null): void {
		let fullPath: string = this.getPath();

		const paramsInPath: RegExpMatchArray | null = fullPath.match(/{(.*?)}/g);
		if (paramsInPath && pathParams) {
			paramsInPath.forEach((param: string): void => {
				const paramValue: string | null = pathParams[param.slice(1, -1)];

				if (paramValue !== null) {
					fullPath = fullPath.replace(param, paramValue);
				}
			});
		}

		if (queryParams) {
			const queryStr: string[] = [];

			Object.entries(queryParams).forEach(([ paramName, paramValue ]): void => {
				if (paramName === undefined || paramName === null) return;
				queryStr.push(`${paramName}=${paramValue}`);
			});

			if (queryStr.length > 0) {
				fullPath = `${fullPath}?${queryStr.join("&")}`;
			}
		}

		this.setRequestPath(fullPath);
	}

	/* ---- Functions --------------------------------- */
	async fetch(pathParams: PathParams | null = null, queryParams: QueryParams | null = null) {
		this.buildFullPath(pathParams, queryParams);
		return super.fetch();
	}
}

/************************************************************
 * Methods
 ***********************************************************/
export class GET<O> extends URIPayload<O> {
	constructor(path: string) {
		super("GET", path);
	}

	async fetch(pathParams: PathParams | null = null, queryParams: QueryParams | null = null) {
		return super.fetch(pathParams, queryParams);
	}
}

export class POST<I extends object | undefined, O> extends BodyPayload<I, O> {
	constructor(path: string) {
		super("POST", path);
		this.addHeaders({ "Content-Type": "application/json" });
	}

	async fetch(args?: I) {
		return super.fetch(args);
	}
}