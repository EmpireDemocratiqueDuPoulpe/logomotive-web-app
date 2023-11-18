import {  useQuery } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptsData } from "@/hooks/scripts/useScripts.types";
import type { QueryParams } from "@/utils/Endpoint.types";

function useScripts(queryParams: QueryParams | undefined = undefined, options: object = {}): UseScriptsData {
	return useQuery({
		...options,
		queryKey: [ "scripts", "ofUser" ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getAllOfUser.fetch(undefined, queryParams))
	});
}

export default useScripts;