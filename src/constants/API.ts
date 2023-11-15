import { GET, POST, PUT } from "@/utils/Endpoint";
import type { PrebuiltAPIConstants } from "@/constants/API.types";
import type { LoginUser, RegisteringUser, User } from "@/contexts/AuthCtx/AuthCtx.types";
import type { Script, NewScript } from "@/typings/global";

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
				getAllOfUser: new GET<{ scripts: Script[] }>("/api/v1/scripts"),
				getByID: new GET<{ script: Script }>("/api/v1/scripts/{scriptID}"),
				save: new PUT<Script, {}>("/api/v1/scripts"),
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