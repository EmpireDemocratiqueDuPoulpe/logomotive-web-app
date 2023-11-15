import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptData } from "@/hooks/scripts/useScript.types";
import type { QueryParams } from "@/utils/Endpoint.types";
import type { NewScript, Script } from "@/typings/global";

function useScript(scriptID: number | null, queryParams: QueryParams | undefined = undefined, options: object = {}): UseScriptData {
	const scriptQuery = useQuery({
		...options,
		queryKey: [ "script", "byID", scriptID ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getByID.fetch({ scriptID: `${scriptID}` }, queryParams)),
		enabled: (!!scriptID)
	});

	const create = useMutation({
		mutationFn: (script: NewScript) => {
			return API.ENDPOINTS.V1.SCRIPTS.create.fetch(script);
		}
	});

	const update = useMutation({
		mutationFn: (script: Script) => {
			return API.ENDPOINTS.V1.SCRIPTS.save.fetch(script);
		}
	});

	return { ...scriptQuery, create, update };
}

export default useScript;