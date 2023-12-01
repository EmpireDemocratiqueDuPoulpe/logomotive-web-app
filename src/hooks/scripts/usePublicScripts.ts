import { useQuery } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UsePublicScriptsData } from "@/hooks/scripts/usePublicScripts.types";

function usePublicScripts(options: object = {}): UsePublicScriptsData {
	return useQuery({
		...options,
		queryKey: [ "scripts", "allPublic" ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getAllPublic.fetch())
	});
}

export default usePublicScripts;