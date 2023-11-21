import {DELETE, GET, POST, PUT} from "@/utils/Endpoint";
import type { PrebuiltAPIConstants } from "@/constants/API.types";
import type { LoginUser, RegisteringUser, User } from "@/contexts/AuthCtx/AuthCtx.types";
import type {
	Script,
	NewScript,
	UpdatingScript,
	ScriptInfo,
	NewScriptSharingLink,
	ScriptSharingLink
} from "@/typings/global";
import {SharingLinkID} from "@/typings/global";

const API: PrebuiltAPIConstants = {
	PROTOCOL: process.env.NEXT_PUBLIC_API_PROTOCOL || "https",
	DOMAIN: process.env.NEXT_PUBLIC_API_DOMAIN || "localhost",
	PORT: process.env.NEXT_PUBLIC_API_PORT || "8443",
};

const ALL = {
	...API,
	BASE_URL: `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}`,
	ENDPOINTS: {
		V1: {
			SCRIPTS: {
				create: new POST<NewScript, { script_id: number }>("/api/v1/scripts"),
				getAllOfUser: new GET<{ scripts: ScriptInfo[] }>("/api/v1/scripts"),
				getAllPublic: new GET<{ scripts: Script[] }>("/api/v1/scripts/all"),
				getByID: new GET<{ script: Script }>("/api/v1/scripts/{scriptID}"),
				save: new PUT<UpdatingScript, {}>("/api/v1/scripts"),
			},
			SCRIPT_SHARING_LINKS: {
				create: new POST<NewScriptSharingLink, SharingLinkID>("/api/v1/scripts/share"),
				getScriptID: new GET<Pick<Script, "script_id">>("/api/v1/scripts/share/{linkID}"),
				getLinksOf: new GET<ScriptSharingLink[]>("/api/v1/scripts/share/links-of/{scriptID}"),
				delete: new DELETE<SharingLinkID, {}>("/api/v1/scripts/share/{scriptID}"),
			},
			USERS: {
				register: new POST<RegisteringUser, { user_id: number }>("/api/v1/users"),
				login: new POST<LoginUser, { sessionID: string, user: User }>("/api/v1/users/login"),
				authenticate: new POST<undefined, { sessionID: string, user: User }>("/api/v1/users/authenticate"),
				logout: new POST<undefined, undefined>("/api/v1/users/logout")
			}
		}
	}
};
export default ALL;