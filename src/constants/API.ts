import { POST } from "@/utils/Endpoint";
import type { PrebuiltAPIConstants } from "@/constants/API.types";
import type { LoginUser, RegisteringUser, User } from "@/contexts/AuthCtx/AuthCtx.types";

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