import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptData } from "@/hooks/scripts/useScript.types";
import type { QueryParams } from "@/utils/Endpoint.types";
import type { NewScript, UpdatingScript } from "@/typings/global";
import useMessageContext from "@/contexts/MessagesCtx/MessagesCtx";
import {JSONResponse} from "@/utils/Endpoint.types";

function useScript(scriptID: number | null, queryParams: QueryParams | undefined = undefined, options: object = {}): UseScriptData {
	const messages = useMessageContext();
	const queryClient: QueryClient = useQueryClient();
	const scriptQuery = useQuery({
		...options,
		queryKey: [ "script", "byID", scriptID ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getByID.fetch({ scriptID: `${scriptID}` }, queryParams)),
		enabled: (!!scriptID),
		throwOnError: (error: Error) : boolean => { messages.add({ status: "error", message: error.message }); return true; }
	});

	const create = useMutation({
		mutationFn: (script: NewScript) => {
			return API.ENDPOINTS.V1.SCRIPTS.create.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["scripts"] }).catch(console.error); },
		onError: (error: JSONResponse) : void => { messages.add({ status: "error", message: error.error ?? "Erreur inconnue" }); }
	});

	const update = useMutation({
		mutationFn: (script: UpdatingScript) => {
			return API.ENDPOINTS.V1.SCRIPTS.save.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["scripts"] }).catch(console.error); },
		onError: (error: JSONResponse) : void => { messages.add({ status: "error", message: error.error ?? "Erreur inconnue" }); }
	});

	return { ...scriptQuery, create, update };
}

export default useScript;