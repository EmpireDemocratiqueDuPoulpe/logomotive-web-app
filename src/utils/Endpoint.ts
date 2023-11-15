import urlJoin from "url-join";
import { API } from "@/constants";
import type { Method, Headers, JSONResponse, PathParams, QueryParams, PathQueryParams } from "./Endpoint.types";

/************************************************************
 * API Endpoint
 ***********************************************************/
class Endpoint<I extends object | undefined, O> {
	private method: Method = "HEAD";
	private path: string = "";
	private globalHeaders: Headers = { "Accept": "application/json" };
	private additionalHeaders: Headers = {};
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

	public addHeaders(headers: Headers): this {
		if (headers) {
			this.additionalHeaders = { ...this.additionalHeaders, ...headers };
		}

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
	private buildFullPath(pathParams?: PathParams, queryParams?: QueryParams): string {
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

		return fullPath;
	}

	protected async send(pathParams?: PathParams, queryParams?: QueryParams, body?: string | I | undefined): Promise<JSONResponse<O>> {
		const uri: string = urlJoin(API.BASE_URL, this.buildFullPath(pathParams, queryParams));
		const options: RequestInit = {
			method: this.method,
			headers: this.getAllHeaders(),
			mode: "cors",
			credentials: this.credentials
		};

		if (body) {
			// @ts-ignore
			options.body = body;
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
	private processBody(args?: I): string | I | undefined {
		let body: string | I | undefined = undefined;

		if (args) {
			body = this.willStringify() ? JSON.stringify(args) : args;
		}

		return body;
	}

	public async fetch(body?: I, pathParams?: PathParams, queryParams?: QueryParams): Promise<JSONResponse<O>> {
		return this.send(pathParams, queryParams, this.processBody(body));
	}
}

class URIPayload<O> extends Endpoint<undefined, O> {
	async fetch(pathParams?: PathParams, queryParams?: QueryParams): Promise<JSONResponse<O>> {
		return this.send(pathParams, queryParams, undefined);
	}
}

/************************************************************
 * Methods
 ***********************************************************/
export class GET<O> extends URIPayload<O> {
	constructor(path: string) {
		super("GET", path);
	}

	async fetch(pathParams?: PathParams, queryParams?: QueryParams): Promise<JSONResponse<O>> {
		return super.fetch(pathParams, queryParams);
	}
}

export class POST<I extends object | undefined, O> extends BodyPayload<I, O> {
	constructor(path: string) {
		super("POST", path);
		this.addHeaders({ "Content-Type": "application/json" });
	}

	async fetch(body?: I): Promise<JSONResponse<O>>;
	async fetch(body?: I, pathQueryParams?: PathQueryParams): Promise<JSONResponse<O>> {
		return super.fetch(body, pathQueryParams?.pathParams, pathQueryParams?.queryParams);
	}
}

export class PUT<I extends object | undefined, O> extends BodyPayload<I, O> {
	constructor(path: string) {
		super("PUT", path);
		this.addHeaders({ "Content-Type": "application/json" });
	}

	async fetch(body?: I): Promise<JSONResponse<O>>;
	async fetch(body?: I, pathQueryParams?: PathQueryParams): Promise<JSONResponse<O>> {
		return super.fetch(body, pathQueryParams?.pathParams, pathQueryParams?.queryParams);
	}
}