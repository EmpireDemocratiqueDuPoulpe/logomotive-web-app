import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptData } from "@/hooks/scripts/useScript.types";
import type { QueryParams } from "@/utils/Endpoint.types";
import type { NewScript, UpdatingScript } from "@/typings/global";
import toast from "react-hot-toast";

function useScript(scriptID: number | null, queryParams: QueryParams | undefined = undefined, options: object = {}): UseScriptData {
	const queryClient: QueryClient = useQueryClient();
	const scriptQuery = useQuery({
		...options,
		queryKey: [ "script", "byID", scriptID ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getByID.fetch({ scriptID: `${scriptID}` }, queryParams)),
		enabled: (!!scriptID)
	});

	const create = useMutation({
		mutationFn: (script: NewScript) => {
			return API.ENDPOINTS.V1.SCRIPTS.create.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["scripts"] }).catch(toast.error); }
	});

	const update = useMutation({
		mutationFn: (script: UpdatingScript) => {
			return API.ENDPOINTS.V1.SCRIPTS.save.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["scripts"] }).catch(toast.error); }
	});

	return { ...scriptQuery, create, update };
}

export default useScript;