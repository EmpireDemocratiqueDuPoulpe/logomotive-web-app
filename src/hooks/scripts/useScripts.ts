import { useQuery } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptsData } from "@/hooks/scripts/useScripts.types";

function useScripts(options: object = {}): UseScriptsData {
	return useQuery({
		...options,
		queryKey: [ "scripts", "ofUser" ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getAllOfUser.fetch())
	});
}

export default useScripts;